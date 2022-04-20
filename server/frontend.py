from flask import Blueprint, render_template

frontend = Blueprint("frontend", __name__, template_folder="templates")


@frontend.route("/")
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
