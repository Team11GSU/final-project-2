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


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    TaskName = db.Column(db.String(100))
    complete = db.Column(db.Boolean, unique=False, default=True)
    project = db.relationship("Project", backref=db.backref("todo"))
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)
    user = db.Column(db.String(256))


class OAuth(OAuthConsumerMixin, db.Model):
    "oauth table"
    provider_user_id = db.Column(db.String(256), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship(User)
