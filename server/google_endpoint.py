from os import getenv
from flask_dance.contrib.google import make_google_blueprint
from flask_dance.consumer.storage.sqla import SQLAlchemyStorage
from flask_dance.consumer import oauth_authorized
from flask_login import current_user, login_user
from dotenv import find_dotenv, load_dotenv
from server.models import db, OAuth, User

load_dotenv(find_dotenv())

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


@oauth_authorized.connect_via(google_blueprint)
def google_logged_in(blueprint, token):
    "google endpoint"
    db.session.begin()
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
        user = User.query.filter_by(email=user_info["email"]).first()
        if not user:
            user = User(email=user_info["email"], name=user_info["name"])
        oauth.user = user
        db.session.add_all([user, oauth])
        db.session.commit()
        login_user(user)

    return False
