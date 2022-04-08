from flask import Blueprint, jsonify, redirect, request
from flask_login import current_user, logout_user
from flask_dance.contrib.google import google
from server.models import Project, db, Event
from server.gmail import Create_Service
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

CLIENT_SECRET_FILE = "server/credentials.json"
API_NAME = "gmail"
API_VERSION = "v1"
SCOPES = ["https://mail.google.com/"]

service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)
# when adding your API route, use the format /<project_id>/your-endpoint
# Then in function definition use def endpoint(project_id)
# query for the particular project and then use current_user and project ID to add

api = Blueprint("api", __name__)


@api.route("/userdata")
def userdata():
    "user data"
    google_data = None
    user_info_endpoint = "oauth2/v2/userinfo"
    if current_user.is_authenticated and google.authorized:
        google_data = google.get(user_info_endpoint).json()
        db.session.begin()
        project = Project.query.filter_by(name="dummy").first()
        # this code creates a dummmy project if it doesn't exit
        # and it adds new users to project if they aren't in
        if not project:
            project = Project(name="dummy")
            db.session.add(project)
        member = list(filter(lambda x: x.email == current_user.email, project.members))
        print(member, flush=True)
        if not member:
            print("here", flush=True)
            project.members.append(current_user)
        user_projects = list(map(lambda x: x.id, current_user.projects))
        print(
            project.id, project.name, project.members, current_user.projects, flush=True
        )
        db.session.commit()
        return jsonify(
            logged_in=True,
            google_data=google_data,
            fetch_url=google.base_url + user_info_endpoint,
            user_projects=user_projects,
        )
    return jsonify(logged_in=False)


@api.route("/logout")
def logout():
    "logout"
    logout_user()
    return redirect("/")


@api.route("/<project_id>/getEvent")
def calendar(project_id):
    "retrieve"
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


@api.route("/<project_id>/addEvent", methods=["POST"])
def add_event(project_id):
    "add event"
    if request.method == "POST":
        db.session.begin()
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


@api.route("/email", methods=["POST"])
def send_email():
    emailMsg = "You have been invited to join our project on https://dynamico-swe.herokuapp.com/project/1."
    data = request.json
    mimeMessage = MIMEMultipart()
    mimeMessage["to"] = data["email"]
    mimeMessage["subject"] = "Dynamico Project Invite"
    mimeMessage.attach(MIMEText(emailMsg, "plain"))
    raw_string = base64.urlsafe_b64encode(mimeMessage.as_bytes()).decode()
    message = (
        service.users().messages().send(userId="me", body={"raw": raw_string}).execute()
    )
    print(message)
    return jsonify({"success": True})
