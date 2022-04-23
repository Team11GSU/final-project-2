import {
  Box, Nav, Form, FormField, TextInput, Button, Avatar, Header, DropButton, Text,
} from 'grommet';
import {
  UserAdd, Logout, ChatOption, Calendar, Task, CloudDownload, Group, User, MailOption,
} from 'grommet-icons';
import {
  Outlet, Link, NavLink, useParams,
} from 'react-router-dom';
import { useState, useCallback } from 'react';
import useUser from './utils/useUser';
import Members from './components/members';
import LoadingScreen from './components/LoadingScreen';
import useProject from './utils/useProject';
import ErrorAlert from './components/errorAlert';

const activeStyle = 'violet';

export default function App() {
  const params = useParams();
  const { isLoading, userData } = useUser();
  const [email, setEmail] = useState({});
  const [error, setError] = useState(false);
  const { projIsLoading, projectData } = useProject(params.projectID);

  // Form to handle sending invites to other people to join the project via e-mail
  const InviteForm = useCallback(() => (
    <Box pad="large" background="light-2">
      <Form
        email={email}
        onChange={(nextemail) => setEmail(nextemail)}
        onSubmit={({ value }) => {
          fetch('/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...value, project: params.projectID }),
          }).then(() => {
            setError(true);
            setEmail('');
          });
        }}
      >
        <FormField name="email" htmlFor="text-input-id" label="Invite a friend">
          <TextInput type="email" id="text-input-id" name="email" required />
        </FormField>
        <Box direction="row" gap="medium">
          <Button type="submit">
            <Box direction="row" gap="xsmall" alignSelf="end" align="center" justify="center">
              <Text color="brand">Send Email</Text>
              {' '}
              <MailOption color="brand" />
            </Box>
          </Button>
        </Box>
      </Form>
    </Box>
  ), []);
  // useParams is used to ensure that the pages that displayed correspond to
  // the current project that the user is operating in
  if (isLoading || projIsLoading) {
    // While the page checks for a logged in user it displays a
    // 'loading' message to indicate that it is in the process
    return (
      <LoadingScreen />
    );
  }

  return (
    <Box pad="medium">
      {/* Checks that there is a user currently logged in through the Google Login flow */}
      <Header>
        {userData != null && (
          <>
            <Link to="/profile">
              <Box direction="row" gap="small" align="center" justify="center">
                <User size="medium" />
                <Avatar src={userData.google_data.picture} />
              </Box>
            </Link>
            <h3>
              {userData.google_data.name}
              {' '}
              /
            </h3>
          </>
        )}
        <h1>{projectData.name}</h1>
        {/* Clickable icons that redirect the user to the appropriate page of the project */}
        <Nav direction="row" pad="medium" gap="medium">
          <NavLink to={`/project/${params.projectID}/chat`}>
            {({ isActive }) => <ChatOption color={isActive ? activeStyle : undefined} />}
          </NavLink>
          <NavLink to={`/project/${params.projectID}/calendar`}>
            {({ isActive }) => <Calendar color={isActive ? activeStyle : undefined} />}
          </NavLink>
          <NavLink to={`/project/${params.projectID}/todo`}>
            {({ isActive }) => <Task color={isActive ? activeStyle : undefined} />}
          </NavLink>
          <NavLink to={`/project/${params.projectID}/files`}>
            {({ isActive }) => <CloudDownload color={isActive ? activeStyle : undefined} />}
          </NavLink>
        </Nav>
        {/* Drop down menu to display the members of the project */}
        <DropButton
          dropContent={<Members members={projectData.members} />}
          dropAlign={{ top: 'bottom' }}
        >
          <Group />
        </DropButton>
        {/* Drop down menu that shows the form used to send an invite to a new member */}
        <DropButton
          dropContent={<InviteForm />}
          dropAlign={{ top: 'bottom' }}
        >
          <UserAdd />
        </DropButton>
        <a aria-label="logout" href="/logout"><Logout color="red" /></a>
      </Header>
      <Box pad={{ vertical: 'xsmall', horizontal: 'xlarge' }}>
        <Outlet />
      </Box>
      {error && <ErrorAlert message="Email will be sent." setError={setError} />}
    </Box>
  );
}
