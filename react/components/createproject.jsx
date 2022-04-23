import {
  Box, Form, FormField, TextInput, Button, Text,
} from 'grommet';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Configure, Tools } from 'grommet-icons';
import ErrorAlert from './errorAlert';

export default function CreateProject() {
  const navigate = useNavigate();
  const [name, setName] = useState({});
  const [error, setError] = useState(false);
  return (
    <Box pad="medium" round border>
      {/* Form to take a name for a Project, if it does not exist the new
          project is created and the user is redirected */}
      {/* If the Project does exist already, the users is notified of the failed attempt */}
      <h3>
        <Tools color="accent-4" />
        {' '}
        Create a Project
      </h3>
      <Form
        value={name}
        onChange={(nextValue) => setName(nextValue)}
        onSubmit={({ value }) => {
          fetch('/createproject', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(value),
          })
            .then((resp) => resp.json())
            .then((data) => (data.success ? navigate(`/project/${data.id}`) : setError(true)));
        }}
      >
        <FormField name="name" htmlFor="text-input-id" label="Project Name">
          <TextInput id="text-input-id" name="name" required />
        </FormField>
        <Box direction="row" gap="medium">
          <Button type="submit">
            <Box direction="row" gap="xsmall" alignSelf="end" align="center" justify="center">
              <Text color="brand">Build</Text>
              {' '}
              <Configure color="brand" />
            </Box>
          </Button>
        </Box>
      </Form>
      {error && <ErrorAlert message="A Project with that name already exists" setError={setError} />}
    </Box>
  );
}
