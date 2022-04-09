import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Messages from './components/Messages';
import MessageInput from './components/MessageInput';

export default function Chat() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <>
      <h1>Chat Page</h1>
      {socket ? (
        <div className="chat-container">
          {/* The Messages component is used to display any new messages that
          were sent including who sent it, what the message contents are and when it was sent */}
          <Messages socket={socket} />
          {/* MessageInput component is used to take the user's
          input and send it through socket.io */}
          <MessageInput socket={socket} />
        </div>
      /* Message is displayed to indicate that the user is not connected to the socket.io server */
      ) : <div>Not Connected!</div>}
    </>
  );
}
