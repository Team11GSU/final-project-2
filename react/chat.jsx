import { useEffect, useState } from "react"
import io from 'socket.io-client';
import Messages from './components/Messages';
import MessageInput from './components/MessageInput';

export default function Chat() {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io();
        setSocket(newSocket);
        return () => newSocket.close();
    }, [setSocket])



    return (
        <>
            <h1>Chat Page</h1>
            {socket ? (
                <div className="chat-container">
                    <Messages socket={socket} />
                    <MessageInput socket={socket} />
                </div>
            ) : <div>Not Connected!</div>}
        </>
    )
}