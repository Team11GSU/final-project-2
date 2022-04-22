# pylint: disable=invalid-name
# pylint: disable=no-member
import os
from flask import Blueprint, jsonify, redirect, render_template, request, url_for
from flask_login import current_user, logout_user
from flask_dance.contrib.google import google
from flask_mail import Mail, Message
import boto3

# from server.gmail import create_service
from server.models import Invite, Project, Todo, db, Event, File

# CLIENT_SECRET_FILE = "server/credentials.json"
# API_NAME = "gmail"
# API_VERSION = "v1"
# SCOPES = ["https://mail.google.com/"]


# # commented out because of token expiry...
#
# service = create_service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

# when adding your API route, use the format /<project_id>/your-endpoint
# Then in function definition use def endpoint(project_id)
# query for the particular project and then use current_user and project ID to add

api = Blueprint("api", __name__, template_folder="templates")


@api.route("/userdata")
def userdata():
    "user data"
    google_data = None
    user_info_endpoint = "oauth2/v2/userinfo"
    if current_user.is_authenticated and google.authorized:
        google_data = google.get(user_info_endpoint).json()
        # db.session.begin()
        # project = Project.query.filter_by(name="dummy").first()
        # this code creates a dummmy project if it doesn't exist
        # and it adds new users to project if they aren't in
        # if not project:
        #     project = Project(name="dummy")
        #     db.session.add(project)
        # member = list(filter(lambda x: x.email == current_user.email, project.members))
        # print(member, flush=True)
        # if not member:
        #     # print("here", flush=True)
        #     project.members.append(current_user)
        # user_projects = list(map(lambda x: x.id, current_user.projects))
        # print(
        # project.id, project.name, project.members, current_user.projects, flush=True
        # )
        # db.session.commit()
        return jsonify(
            logged_in=True,
            google_data=google_data,
            fetch_url=google.base_url + user_info_endpoint,
            # user_projects=user_projects,
        )
    return jsonify(logged_in=False)


@api.route("/logout")
def logout():
    "logout"
    logout_user()
    return redirect("/")


@api.route("/todo/<project_id>", methods=["GET", "POST"])
def todo(project_id):
    "todo"
    if request.method == "POST":
        # when a POST request is sent to the api the json data that is
        # submitted is stored in the todo table in the database
        new_todo = request.json
        db.session.begin()
        project = Project.query.filter_by(id=project_id).first()
        new_todo = Todo(TaskName=new_todo["TaskName"], user=current_user.name)
        project.todos.append(new_todo)
        db.session.commit()
    project = Project.query.filter_by(id=project_id).first()
    todos = project.todos

    # function returns json data back to the react page when a GET request is sent
    return jsonify(
        [
            {
                "id": todo.id,
                "TaskName": todo.TaskName,
                "user": todo.user,
                "complete": todo.complete,
            }
            for todo in todos
        ]
    )


@api.route("/todo/<todo_id>/delete", methods=["POST"])
def delete_todo(todo_id):
    # Function serves to delete a specific todo item from the database using a POST request
    "todo"
    db.session.begin()
    # The specific todo item is selected by querying the database for the unique id
    Todo.query.filter_by(id=todo_id).delete()
    db.session.commit()
    return jsonify({"deleted": True})


@api.route("/todo/<todo_id>/toggle", methods=["POST"])
def todo_toggle(todo_id):
    # Function serves to manage the status of a particular todo item between complete and incomplete
    "todo"
    db.session.begin()
    toggled_todo = Todo.query.filter_by(id=todo_id).first()
    # based on the current status of the todo, the opposite status is
    # applied and the item is updated in the database
    toggled_todo.complete = not toggled_todo.complete
    db.session.commit()
    # print(todo_id, toggled_todo.complete, flush=True)

    return jsonify({"switched": True})


@api.route("/<project_id>/getEvent")
def calendar(project_id):
    "retrieve"
    # query the event table of the database for all existing events for the current project
    events = Event.query.filter_by(project_id=int(project_id)).all()
    # returns the data as a json to the react page using a GET request
    return jsonify(
        [
            {
                "title": event.title,
                "description": event.description,
                "sDate": event.sDate,
                "eDate": event.eDate,
                "category": event.category,
                "user": event.user,
            }
            for event in events
        ]
    )


@api.route("/getUserEvents")
def userEvents():
    "user events for calendar"
    # Create a list of project IDs that the current use is a member of
    # For each Project ID in the list, the Event table is queried to return all events
    # the current user is a member of
    user_projects = list(map(lambda x: x.id, current_user.projects))
    print("user+pro", user_projects)
    events = []

    for data in user_projects:
        events += Event.query.filter_by(project_id=data).all()

    return jsonify(
        [
            {
                "title": event.title,
                "description": event.description,
                "sDate": event.sDate,
                "eDate": event.eDate,
                "category": event.category,
                "projectID": event.project_id,
            }
            for event in events
        ]
    )


@api.route("/getUserProjects")
def userProjects():
    "user projects"

    # Returns a dictionary of project data for all projects that the current user is a member of
    return jsonify(
        [
            {"name": project.name, "project_id": project.id,}
            for project in current_user.projects
        ]
    )


@api.route("/getUserInvites")
def getUserInvites():
    "user invites"

    # Query the Invite table of the database to find pending invites for the current user
    invites = Invite.query.filter_by(email=current_user.email).all()
    return jsonify(
        [
            {
                "id": invite.id,
                "invited_by": invite.invited_by,
                "project_id": invite.project_id,
                "project_name": invite.project_name,
            }
            for invite in invites
        ]
    )


@api.route("/accept/<project_id>")
def accept_invite(project_id):
    "accept user invites"
    # Upon accepting a project invite, said invite is removed from the table
    # The user is added as a member of the relevant project
    print("here", project_id, flush=True)
    db.session.begin()
    Invite.query.filter_by(email=current_user.email, project_id=project_id).delete()
    project = Project.query.filter_by(id=project_id).first()
    project.members.append(current_user)
    print(project.members, flush=True)
    db.session.commit()
    return jsonify({"success": True})

@api.route("/decline/<project_id>")
def decline_invite(project_id):
    "decline user invites"
    print("here", project_id, flush=True)
    db.session.begin()
    Invite.query.filter_by(email=current_user.email, project_id=project_id).delete()
    db.session.commit()
    return jsonify({"success": True})


@api.route("/<project_id>/getProjectData")
def get_project_data(project_id):
    "project data"

    # Query the Project table to find all members of a project and returns their e-mail and names
    project = Project.query.filter_by(id=project_id).first()
    members = list(filter(lambda x: x.email, project.members))

    return jsonify(
        {
            "name": project.name,
            "members": [
                {"name": member.name, "email": member.email,} for member in members
            ],
        }
    )


@api.route("/createproject", methods=["POST"])
def create_project():
    "create project"

    # POST request is used to get Project Name
    # Checks if the Project already exists by querying for a matching name
    # If it does not exist, a new Project is created and the current user is added as a member
    data = request.get_json()
    db.session.begin()
    project = Project.query.filter_by(name=data["name"]).first()
    if not project:
        project = Project(name=data["name"])
        project.members.append(current_user)
        db.session.add(project)
        db.session.commit()
        print(project.id)
        return jsonify({"success": True, "id": project.id})
    else:
        return jsonify({"success": False})
    # member = list(filter(lambda x: x.email == current_user.email, project.members))
    # if not member:
    #
    # user_projects = list(map(lambda x: x.id, current_user.projects))


@api.route("/<project_id>/addEvent", methods=["POST"])
def add_event(project_id):
    "add event"
    if request.method == "POST":
        db.session.begin()
        # using a POST request, takes the json form data that is submitted and
        # stores it as a new item in the Event table of the database
        event_title = request.json.get("title")
        event_sdate = request.json.get("sDate")
        event_edate = request.json.get("eDate")
        event_desc = request.json.get("description")
        event_cat = request.json.get("category")
        new_event = Event(
            title=event_title,
            sDate=event_sdate,
            eDate=event_edate,
            description=event_desc,
            category=event_cat,
            user=current_user.name,
            project_id=int(project_id),
        )
        db.session.add(new_event)
        db.session.commit()

        # query all events for the relevant project id and returns that json data
    events = Event.query.filter_by(project_id=int(project_id)).all()
    return jsonify(
        [
            {
                "title": event.title,
                "description": event.description,
                "sDate": event.sDate,
                "eDate": event.eDate,
                "category": event.category,
                "user": event.user,
            }
            for event in events
        ]
    )


mail = Mail()

# @api.route("/email", methods=["POST"])
# def send_email():
# "sends an email (currently through personal mail)"
# email_msg = "You have been invited to join our \
# project on https://dynamico-swe.herokuapp.com/project/1."
# data = request.json
# mime_message = MIMEMultipart()
# mime_message["to"] = data["email"]
# mime_message["subject"] = "Dynamico Project Invite"
# mime_message.attach(MIMEText(email_msg, "html"))
# raw_string = base64.urlsafe_b64encode(mime_message.as_bytes()).decode()
# message = (
#     service.users().messages().send(userId="me", body={"raw": raw_string}).execute()
# )
# print(message)
# return jsonify({"success": True})

BASE_URL = "https://dynamico-2.herokuapp.com"


@api.route("/email", methods=["POST"])
def send_email():
    "sends an email"

    # Checks if there is a pending invite sent to a certain user
    # if there is not an e-mail is sent inviting them to join the corresponding project
    data = request.json
    subject = f"You have been invited by {current_user.name} to Dynamico!"
    sender = os.getenv("MAIL_USERNAME")
    recipient = data["email"]
    invite = Invite.query.filter_by(
        email=recipient, project_id=int(data["project"])
    ).first()
    if not invite:
        db.session.begin()
        project = Project.query.filter_by(id=int(data["project"])).first()
        project_name = project.name
        invite = Invite(
            email=recipient, invited_by=current_user.name, project_name=project_name,
        )
        project.invites.append(invite)
        db.session.commit()
        msg = Message(subject, sender=sender, recipients=[recipient])
        msg.html = render_template(
            "email_invite.html",
            url=f'{BASE_URL}/project/{data["project"]}',
            project_name=project_name,
        )
        # msg.body = "You have been invited to join our \
        #      project on https://dynamico-swe.herokuapp.com/project/1."
        mail.send(msg)
    return jsonify({"success": True})


@api.route("/<project_id>/s3/list")
def files_list(project_id):
    "generates presigned s3 url to save file to"
    S3_BUCKET = "team11-finalproject-dynamico"
    # AWS_REGION = "us-east-1"
    # Query the File table for all files shared in a project and returns them to be displayed
    files = File.query.filter_by(project_id=project_id).all()

    return jsonify(
        {
            "url": f"https://{S3_BUCKET}.s3.amazonaws.com/",
            "files": [
                {"id": file.id, "name": file.file_name, "type": file.file_type,}
                for file in files
            ],
        }
    )


@api.route("/<project_id>/s3/sign")
def presigned_route(project_id):
    "generates presigned s3 url to save file to"
    # Takes the supplied file stores it with AWS S3
    # Appends the file to the proper project
    S3_BUCKET = "team11-finalproject-dynamico"

    file_name = request.args.get("filename")
    file_type = request.args.get("filetype")
    print(file_name, file_type, flush=True)
    s3 = boto3.client("s3")
    presigned_post = s3.generate_presigned_post(
        Bucket=S3_BUCKET,
        Key=f"Project_{project_id}_{file_name}",
        Fields={"acl": "public-read", "Content-Type": file_type},
        Conditions=[{"acl": "public-read"}, {"Content-Type": file_type}],
        ExpiresIn=3600,
    )

    db.session.begin()
    project = Project.query.filter_by(id=project_id).first()
    file = File(
        file_name=f"Project_{project_id}_{file_name}",
        file_type=file_type,
        user=current_user.name,
    )
    project.files.append(file)
    db.session.commit()
    return jsonify(presigned_post)
