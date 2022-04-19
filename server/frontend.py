from flask import Blueprint, render_template

frontend = Blueprint("frontend", __name__, template_folder="templates")


@frontend.route("/")
@frontend.route("/loginform")
@frontend.route("/profile")
@frontend.route("/project/<projectID>/")
@frontend.route("/project/<projectID>/calendar")
@frontend.route("/project/<projectID>/todo")
@frontend.route("/project/<projectID>/chat")
@frontend.route("/project/<projectID>/files")
# pylint: disable=unused-argument
def index(project_id=1):
    "index"
    return render_template("index.html")
