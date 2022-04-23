# pylint: disable=too-few-public-methods

from datetime import datetime, timezone
from flask_login import UserMixin
from flask_dance.consumer.storage.sqla import OAuthConsumerMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(session_options={"autocommit": True})  # prevents pool overflow

"""
IMPORTANT IMPORTANT IMPORTANT

run

    heroku pg:reset --confirm dynamico-swe in your terminal
every time you make changes to the DB structure here
"""

user_project = db.Table(
    "user_project",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
    db.Column("project_id", db.Integer, db.ForeignKey("project.id")),
)


class Invite(db.Model):
    "invites storage model"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(256))
    invited_by = db.Column(db.String(256))
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)
    project_name = db.Column(db.String(256))
    project = db.relationship("Project", backref=db.backref("invites"))


class User(db.Model, UserMixin):
    "user model"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(256), unique=True)
    name = db.Column(db.String(256))
    projects = db.relationship("Project", secondary=user_project, backref="members")

    def __repr__(self) -> str:
        return f"<{self.email}>"


class Project(db.Model):
    "project model"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256))

    def __repr__(self) -> str:
        return f"<{self.name}>"


class Message(db.Model):
    "message model"
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(
        db.BigInteger, default=int(datetime.now(tz=timezone.utc).timestamp() * 1000)
    )
    user = db.Column(db.String(256))
    value = db.Column(db.String(4096))
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)
    project = db.relationship("Project", backref=db.backref("messages"))


class File(db.Model):
    "files model"
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(256))
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)
    project = db.relationship("Project", backref=db.backref("files"))
    file_name = db.Column(db.String(256))
    file_type = db.Column(db.String(128))


class Todo(db.Model):
    "todos model"
    id = db.Column(db.Integer, primary_key=True)
    TaskName = db.Column(db.String(100))
    complete = db.Column(db.Boolean, unique=False, default=False)
    project = db.relationship("Project", backref=db.backref("todos"))
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)
    user = db.Column(db.String(256))


class Event(db.Model):
    "calendar model"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(300), nullable=True)
    sDate = db.Column(db.String(10), nullable=False)
    eDate = db.Column(db.String(10), nullable=True)
    category = db.Column(db.String(8), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)
    project = db.relationship("Project", backref=db.backref("events"))
    user = db.Column(db.String(256))


class OAuth(OAuthConsumerMixin, db.Model):
    "oauth table"
    provider_user_id = db.Column(db.String(256), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship(User)
