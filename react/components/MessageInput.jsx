import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Button, Form, FormField, TextArea, Text,
} from 'grommet';
import { Send } from 'grommet-icons';
import PropTypes from 'prop-types';

function NewMessage({ socket }) {
  const params = useParams();
  // Similar useState usage as with other files such as in calendar.jsx
  const [message, setMessage] = useState({});
  const submitForm = useCallback(({ value }) => {
    const msg = {
      message: value.message,
      project: params.projectID,
    };
    socket.emit('message', msg);
  }, []);

  return (
    // Form used to take the user's input and send it to the database via socket.io
    <Box
      style={{
        position: 'absolute',
        bottom: '10px',
        width: '80%',
      }}
      round="small"
      border
    >
      <Form
        onSubmit={submitForm}
        message={message}
        onChange={(newmessage) => {
          setMessage(newmessage);
        }}
      >
        <Box round="small" background="white" pad="small" direction="row" gap="10px" align="stretch" justify="around">
          <FormField name="message" required width="100%">
            <TextArea
              resize={false}
              name="message"
              type="message"
              placeholder="Type your message here, you can use *Markdown*!"
            />
          </FormField>
          <Button type="submit">
            <Box direction="row" gap="xsmall" alignSelf="end" align="center" justify="center">
              <Text color="blue">Send</Text>
              {' '}
              <Send color="blue" />
            </Box>
          </Button>
        </Box>
      </Form>
    </Box>
  );
}

NewMessage.propTypes = {
  socket: PropTypes.shape({
    emit: PropTypes.func,
  }).isRequired,
};

export default NewMessage;
