import os
from flask import Flask, render_template
# from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from werkzeug.exceptions import HTTPException
from dotenv import find_dotenv, load_dotenv


from server.models import db, User
from server.google_endpoint import google_blueprint
from server.frontend import frontend
from server.api import api

load_dotenv(find_dotenv())

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

path = os.path.dirname(os.path.realpath(__file__))
db_path = os.path.join(path, "app.db")


app = Flask(__name__)
# To making the source HTML look cleaner
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True
# Point SQLAlchemy to Heroku database, changes url to correct format
# app.config["SQLALCHEMY_DATABASE_URI"] = getenv("DATABASE_URL").replace(
#     "postgres://", "postgresql://"
# )
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + db_path
# Gets rid of a warning
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = os.getenv("SECRET_KEY")

app.register_blueprint(frontend)
app.register_blueprint(api)
app.register_blueprint(google_blueprint)

login_manager = LoginManager()
# # can actually login from any screen
login_manager.init_app(app)
login_manager.login_view = "frontend.index"


@login_manager.user_loader
def load_user(user_id):
#     "loading user for flask-login"
#     # pylint: disable=no-member
#     return db.session.get(User, user_id)
    return User.query.get(int(user_id))


# @app.errorhandler(Exception)
# def handle_error(error):
#     "error handler"
#     code = 500
#     if isinstance(error, HTTPException):
#         code = error.code
#         if code == 404:
#             return render_template("index.html"), 404
#     return render_template("index.html"), code


db.init_app(app)


# # pylint: disable=unused-argument
# @app.teardown_appcontext
# def shutdown_session(exception=None):
#     "to help prevent pool overflow"
#     db.session.remove()
#     db.engine.dispose()


# @app.teardown_request
# def shutdown_request(exception=None):
#     "to help prevent pool overflow"
#     db.session.remove()


with app.app_context():
    db.create_all()
# uncomment during development
# app.run(
#     debug=True,
#     host=os.getenv("IP", "0.0.0.0"),
#     port=int(os.getenv("PORT", "8080")),
# )