from flask import Blueprint, jsonify, redirect, request
from flask_login import current_user, logout_user
from flask_dance.contrib.google import google
from server.models import Project, Todo, db, Event

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


@api.route("/todo/<project_id>", methods=["GET", "POST"])
def todo(project_id):
    "todo"
    if request.method == "POST":
        # when a POST request is sent to the api the json data that is submitted is stored in the todo table in the database
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
    # based on the current status of the todo, the opposite status is applied and the item is updated in the database
    toggled_todo.complete = not toggled_todo.complete
    db.session.commit()
    print(todo_id, toggled_todo.complete, flush=True)

    return jsonify({"switched": True})


@api.route("/logout")
def logout():
    "logout"
    logout_user()
    return redirect("/")


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


@api.route("/<project_id>/addEvent", methods=["POST"])
def add_event(project_id):
    "add event"
    if request.method == "POST":
        db.session.begin()
        # using a POST request, takes the json form data that is submitted and stores it as a new item in the Event table of the database
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
