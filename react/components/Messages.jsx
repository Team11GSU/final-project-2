/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Grid, Avatar, Markdown, Text,
} from 'grommet';
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
        // console.log(message);
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
    <Box pad={{ bottom: 'xlarge' }}>
      {[...Object.values(messages)]
        .sort((a, b) => a.time - b.time)
        .map((message) => (
          <Grid key={message.id} columns={['xsmall', 'large']}>
            <Box align="end" pad="small">
              <Avatar background="dark-4" align="center" flex={false} justify="center" overflow="hidden" round="full">
                {message.user[0]}
              </Avatar>
            </Box>
            <Box align="start" justify="center">
              <Box align="center" justify="center" direction="row" gap="small">
                <Text size="large" weight="bold">{message.user}</Text>
                <Text textAlign="end">
                  at
                  {' '}
                  {new Date(message.time).toLocaleDateString()}
                  {' '}
                  {new Date(message.time).toLocaleTimeString()}
                </Text>
              </Box>
              <Box wrap>
                <Markdown>{message.value}</Markdown>
              </Box>
            </Box>
          </Grid>
        ))}
    </Box>
  );
}

export default Messages;
