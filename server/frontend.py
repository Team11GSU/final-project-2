from flask import Blueprint, redirect, render_template
from flask_login import current_user

frontend = Blueprint("frontend", __name__, template_folder="templates")


@frontend.route("/")
@frontend.route("/landingPage")
def landing_page():
    "landing page"
    if current_user.is_authenticated:
        return redirect("/profile")
    return render_template("landingPage.html")


@frontend.route("/loginform")
@frontend.route("/profile")
@frontend.route("/project/<project_id>/")
@frontend.route("/project/<project_id>/calendar")
@frontend.route("/project/<project_id>/todo")
@frontend.route("/project/<project_id>/chat")
@frontend.route("/project/<project_id>/files")
@frontend.route("/project/<project_id>/members")
# pylint: disable=unused-argument
def index(project_id=1):
    "index"
    return render_template("index.html")
