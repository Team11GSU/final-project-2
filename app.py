import os
from flask import Flask, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, current_user, login_user, logout_user
from flask_dance.consumer import oauth_authorized
from flask_dance.contrib.google import make_google_blueprint, google
from flask_dance.consumer.storage.sqla import SQLAlchemyStorage
from models import db, User, OAuth


from os import getenv
from server.frontend import frontend

# from werkzeug.exceptions import HTTPException
# from dotenv import find_dotenv, load_dotenv

# load_dotenv(find_dotenv())

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

path = os.path.dirname(os.path.realpath(__file__))
db_path = os.path.join(path, "app.db")

app = Flask(__name__)
# To making the source HTML look cleaner
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True
# Point SQLAlchemy to Heroku database, changes url to correct format
app.config["SQLALCHEMY_DATABASE_URI"] = getenv("DATABASE_URL").replace(
    "postgres://", "postgresql://"
)
# Gets rid of a warning
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = getenv("SECRET_KEY")

app.register_blueprint(frontend)
# app.register_blueprint(auth)

db = SQLAlchemy(app)
login_manager = LoginManager()
# # can actually login from any screen
login_manager.init_app(app)
login_manager.login_view = "routes.index"


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
#             return render_template("404.html"), 404
#     return render_template("500.html"), code


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
app.run(
    debug=True,
    host=getenv("IP", "0.0.0.0"),
    port=int(getenv("PORT", "8080")),
)

google_blueprint = make_google_blueprint(
    client_id=getenv("CLIENT_ID"),
    client_secret=getenv("CLIENT_SECRET"),
    scope=[
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
    ],
    offline=True,
    reprompt_consent=True,
    storage=SQLAlchemyStorage(OAuth, db.session, user=current_user),
)

app.register_blueprint(google_blueprint)


@app.route("/")
def index():
    google_data = None
    user_info_endpoint = "oauth2/v2/userinfo"
    if current_user.is_authenticated and google.authorized:
        google_data = google.get(user_info_endpoint).json()
    return render_template(
        "index.j2",
        google_data=google_data,
        fetch_url=google.base_url + user_info_endpoint,
    )


@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("index"))


@oauth_authorized.connect_via(google_blueprint)
def google_logged_in(blueprint, token):
    resp = blueprint.session.get("/oauth2/v2/userinfo")
    user_info = resp.json()
    user_id = str(user_info["id"])
    oauth = OAuth.query.filter_by(
        provider=blueprint.name, provider_user_id=user_id
    ).first()
    if not oauth:
        oauth = OAuth(provider=blueprint.name, provider_user_id=user_id, token=token)
    else:
        oauth.token = token
        db.session.add(oauth)
        db.session.commit()
        login_user(oauth.user)
    if not oauth.user:
        user = User(email=user_info["email"], name=user_info["name"])
        oauth.user = user
        db.session.add_all([user, oauth])
        db.session.commit()
        login_user(user)

    return False
