/* eslint-disable no-alert */
import {
  Box, Form, FormField, TextInput, Button, Text,
} from 'grommet';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Configure, Tools } from 'grommet-icons';

export default function CreateProject() {
  const navigate = useNavigate();
  const [name, setName] = useState({});
  return (
    <Box pad="medium" round border>
      {/* Page where a list of your current project's members will be displayed */}
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
            .then((data) => (data.success ? navigate(`/project/${data.id}`) : alert('Project already exists.')));
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
    </Box>
  );
}
