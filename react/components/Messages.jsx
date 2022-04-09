import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardBody, CardHeader, CardFooter } from 'grommet';
// to be replaced with Grommet components later

function Messages({ socket }) {
    const params = useParams();
    const [messages, setMessages] = useState({});

    // Similar useEffect usage as with other files
    useEffect(() => {
        const messageListener = (message) => {
            setMessages((prevMessages) => {
                const newMessages = { ...prevMessages };
                newMessages[message.id] = message;
                console.log(message)
                return newMessages;
            });
        };

        // const deleteMessageListener = (messageID) => {
        //     setMessages((prevMessages) => {
        //         const newMessages = { ...prevMessages };
        //         delete newMessages[messageID];
        //         return newMessages;
        //     });
        // };

        socket.on('message', messageListener);
        // socket.on('deleteMessage', deleteMessageListener);
        socket.emit('getMessages', params.projectID);

        return () => {
            socket.off('message', messageListener);
            // socket.off('deleteMessage', deleteMessageListener);
        };
    }, [socket]);

    return (
        <Box>
            {[...Object.values(messages)]
                .sort((a, b) => a.time - b.time)
                .map((message) => (
                    <Card
                        key={message.id}
                        title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}
                    >
                        <CardHeader><span className="user">{message.user}:</span></CardHeader>
                        <CardBody><span className="message">{message.value}</span></CardBody>
                        <CardFooter><span className="date">{new Date(message.time).toLocaleTimeString()}</span></CardFooter>
                    </Card>
                ))
            }
        </Box>
    );
}

export default Messages;
