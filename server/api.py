from flask import Blueprint, jsonify, redirect
from flask_login import current_user, logout_user
from flask_dance.contrib.google import google


api = Blueprint("api", __name__)

@api.route("/userdata")
def userdata():
    "user data"
    google_data = None
    user_info_endpoint = "oauth2/v2/userinfo"
    if current_user.is_authenticated and google.authorized:
        google_data = google.get(user_info_endpoint).json()
        return jsonify(
            logged_in=True,
            google_data=google_data,
            fetch_url=google.base_url + user_info_endpoint,
        )
    return jsonify(logged_in=False)


@api.route("/logout")
def logout():
    "logout"
    logout_user()
    return redirect("/")

