from flask import Blueprint, render_template

frontend = Blueprint("frontend", __name__, template_folder="templates")

@frontend.route("/")
@frontend.route("/loginform")
def index():
    "index"
    return render_template("index.html")
