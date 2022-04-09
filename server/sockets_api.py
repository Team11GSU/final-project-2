from flask_socketio import emit, SocketIO
from flask_login import current_user
from server.models import db, Message, Project

socketio = SocketIO()

# messages = []


def message_to_dict(message: Message):
    "converts message object to dict"
    return {
        "id": message.id,
        "time": message.time,
        "user": message.user,
        "value": message.value,
    }


@socketio.on("message")
def handle_message(message):
    "handle"
    print(message, flush=True)
    db.session.begin()
    new_message = Message(user=current_user.name, value=message["message"])
    project = Project.query.filter_by(id=int(message["project"])).first()
    project.messages.append(new_message)
    db.session.commit()
    emit("message", message_to_dict(new_message), broadcast=True, json=True)


@socketio.on("getMessages")
def get_messages(project_id):
    "get"
    print("here", flush=True)
    project = Project.query.filter_by(id=int(project_id)).first()
    messages = project.messages
    messages = list(map(message_to_dict, messages))
    for message in messages:
        emit("message", message, broadcast=True, json=True)

@socketio.on("test_message")
def test_message(message):
    "test handler because other methods interact with db"
    emit("test_message", message)


# @socketio.on('deleteMessage')
# def handle_delete_message(message):
#     print(message, flush=True)
#     send(message)
