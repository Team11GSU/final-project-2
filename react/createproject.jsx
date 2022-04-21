/* eslint-disable no-alert */
import {
  Box, Form, FormField, TextInput, Button,
} from 'grommet';
import { useState } from 'react';

export default function CreateProject() {
  const [name, setName] = useState({});

  return (
    <Box pad="medium" round border>
      {/* Page where a list of your current project's members will be displayed */}
      <h3>Create a Project</h3>
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
          }).then(() => alert('Project will be created.'));
        }}
      >
        <FormField name="name" htmlFor="text-input-id" label="Project Name">
          <TextInput id="text-input-id" name="name" />
        </FormField>
        <Box direction="row" gap="medium">
          <Button type="submit" primary label="Submit" />
        </Box>
      </Form>
    </Box>
  );
}
