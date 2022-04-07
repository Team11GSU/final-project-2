from flask import Blueprint, jsonify, redirect
from flask_login import current_user, logout_user
from flask_dance.contrib.google import google
from server.models import Project, db

# when adding your API route, use the format /<projectID>/your-endpoint
# Then in function definition use def endpoint(projectID)
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


@api.route("/<projectID>/getEvent")
def calendar(projectID):
    events = Event.query.filter_by(projectID=projectID).all()
    return flask.jsonify(
        [
            {
                "title": events.title,
                "description": events.description,
                "sDate": events.sDate,
                "eDate": events.eDate,
                "category": events.category,
            }
            for event in events
        ]
    )


@api.route("/<projectID>/addEvent", methods=["POST"])
def add_event(projectID):
    if flask.request.method == "POST":
        event_title = flask.request.form.get("title")
        event_sdate = flask.request.form.get("sDate")
        event_edate = flask.request.form.get("eDate")
        event_desc = flask.request.form.get("description")
        event_cat = flask.request.form.get("category")
        new_event = Event(
            title=event_title,
            sDate=event_sdate,
            eDate=event_edate,
            description=event_desc,
            category=event_cat,
        )
        db.session.add(new_event)
        db.session.commit()

    return

