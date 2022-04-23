from unittest import TestCase, main, mock
from server.sockets_api import socketio
from app import app
from server.models import Message, Event, Project
from server.sockets_api import message_to_dict


class TestSockets(TestCase):
    "tests for socketio"

    def test_connect(self):
        "testing connection of the socket server"
        # this is a mocked test, socketio has inbuilt mock clients
        client1 = socketio.test_client(app)
        client2 = socketio.test_client(app)
        self.assertTrue(client1.is_connected())
        self.assertTrue(client2.is_connected())
        self.assertNotEqual(client1.eio_sid, client2.eio_sid)

    def test_get_messages(self):
        "testing getting messages"
        client1 = socketio.test_client(app)
        self.assertTrue(client1.is_connected())
        client1.emit("test_message", "hello")
        recieved = client1.get_received()
        self.assertEqual(len(recieved), 1)


class MockedTests(TestCase):
    "tests API calls"

    @mock.patch("server.api.current_user")
    def test_user_projects(self, test_user):
        "calendar test"
        tester = app.test_client(self)
        test_user.projects = [
            Project(name="a", id=1),
            Project(name="b", id=2),
            Project(name="c", id=3),
        ]
        resp = tester.get("/getUserProjects")
        self.assertEqual(
            resp.json,
            [
                {
                    "name": "a",
                    "project_id": 1,
                },
                {
                    "name": "b",
                    "project_id": 2,
                },
                {
                    "name": "c",
                    "project_id": 3,
                },
            ],
        )

    @mock.patch("server.api.Event")
    def test_calendar(self, mock_event):
        "calendar test"
        tester = app.test_client(self)
        mock_event.query.filter_by(project_id=1).all.return_value = [
            Event(
                title="title",
                description="description",
                sDate="sDate",
                eDate="eDate",
                category="category",
                user="user",
            )
        ]
        resp = tester.get("/1/getEvent")
        self.assertEqual(
            resp.json,
            [
                {
                    "title": "title",
                    "description": "description",
                    "sDate": "sDate",
                    "eDate": "eDate",
                    "category": "category",
                    "user": "user",
                }
            ],
        )


class UnmockedTests(TestCase):
    "tests helper methods"

    def test_message_helper(self):
        "testing the json converter"
        message = Message(user="test_user", value="test message")
        dict_message = message_to_dict(message=message)
        self.assertDictEqual(
            dict_message,
            {
                "id": message.id,
                "time": message.time,
                "user": message.user,
                "value": message.value,
            },
        )

    def test_homepage(self):
        "tests index.html successfully redirects for registered endpoints"
        tester = app.test_client(self)
        pages = ["/", "/loginform"]
        for page in pages:
            response = tester.get(page)
            self.assertEqual(response.status_code, 200)
        response = tester.get("email")
        self.assertEqual(response.status_code, 405)


if __name__ == "__main__":
    main()
