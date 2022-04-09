import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Form, FormField, TextInput } from 'grommet';

const NewMessage = ({ socket }) => {
  const params = useParams();
  // Similar useState usage as with other files such as in calendar.jsx
  const [message, setMessage] = useState({});
  const submitForm = ({ value }) => {
    const msg = {
      message: value.message,
      project: params.projectID
    }
    socket.emit('message', msg);
    console.log(msg)
    setMessage('');
  };

  return (
    // Form used to take the user's input and send it to the database via socket.io
    <Form onSubmit={submitForm} message={message} onChange={(newmessage) => {
      setMessage(newmessage);
    }}>
      <FormField name="message" required>
        <TextInput name="message" type="message" placeholder="Type your message" />
      </FormField>
      <Button type="submit" label="Send" primary />
    </Form>
  );
};

export default NewMessage;