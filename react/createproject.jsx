/* eslint-disable no-alert */
import {
  Box, Form, FormField, TextInput, Button, Nav,
} from 'grommet';
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import useUser from './utils/useUser';

export default function CreateProject() {
  const { userData } = useUser();
  const [value, setValue] = useState({});

  return (
    <Box pad="large">
      {/* Page where a list of your current project's members will be displayed */}
      <h1>Project Creation Page </h1>
      {userData != null && (
        <>
          Hello
          {' '}
          {userData.google_data.name}
          <p>
            Click
            {' '}
            <a href="/logout">here</a>
            {' '}
            to log out of
            {' '}
            {userData.google_data.email}
          </p>
          <Form
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
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
            <FormField name="name" htmlFor="text-input-id" label="Create or Join a Project">
              <TextInput id="text-input-id" name="name" />
            </FormField>
            <Box direction="row" gap="medium">
              <Button type="submit" primary label="Submit" />
            </Box>
          </Form>
        </>

      )}
      <Nav direction="row" pad="medium">
        <Link to="/profile">Then go to User Profile</Link>
      </Nav>
      <Outlet />
    </Box>
  );
}
