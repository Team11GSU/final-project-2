/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Avatar, Header, Text, Grid, Button,
} from 'grommet';
import {
  Logout, User, Projects, Inbox, Schedule, FormCheckmark, FormClose,
} from 'grommet-icons';
import useUser from './utils/useUser';
import CreateProject from './createproject';

export default function UserProfile() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [projData, setProjData] = useState([]);
  const [invites, setInvites] = useState([]);
  const { userData } = useUser();

  // useEffect is used to continuously get all of the events from projects that the current user is member of
  useEffect(() => {
    fetch('/getUserEvents')
      .then((response) => response.json())
      .then((cdata) => {
        // console.log(cdata);
        setData(cdata.map((elem) => ({
          title: elem.title,
          start: elem.sDate,
          end: elem.eDate,
          description: elem.description,
          category: elem.category,
          projectID: elem.projectID,
        })));
      });
  }, []);

  //Similar usage of useEffect is employed to retrieve a list of all projects the user is a member of 
  useEffect(() => {
    fetch('/getUserProjects')
      .then((response) => response.json())
      .then((pdata) => {
        // console.log(cdata);
        setProjData(pdata);
      });
  }, []);

  //Similar usage to retrieve all of the user's pending invites to other projects
  useEffect(() => {
    fetch('/getUserInvites')
      .then((response) => response.json())
      .then((idata) => {
        // console.log(cdata);
        setInvites(idata);
      });
  }, []);

  function show(info) {
    alert(`Details: \n Title: ${info.event.title
    }\n Description: ${info.event.extendedProps.description
    }\n Start Date: ${info.event.start
    }\n End Date: ${info.event.end
    }\n Category: ${info.event.extendedProps.category
    }\n ProjectID: ${info.event.extendedProps.projectID}`);
  }

  function colorCode(arg) {
    if (arg.event.extendedProps.category === 'Event') {
      arg.el.style.backgroundColor = '#059849';
    } else {
      arg.el.style.backgroundColor = '#980505';
    }
  }

  return (
    <Box pad="medium">
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
        <h1>User Profile</h1>
        <a aria-label="logout" href="/logout">
          <Box direction="row" align="center" justify="center" gap="small">
            <Text color="red">Logout</Text>
            {' '}
            <Logout color="red" />
          </Box>
        </a>
      </Header>
      <Box align="center" flex="grow" justify="center" direction="row">
        <Grid columns={['medium', 'large']} gap="large">
          <Box justify="center" pad="small" border round gap="small">
            <Box align="left" justify="center" border round pad="medium">
              <h2>
                <Projects color="accent-1" />
                {' '}
                Your Projects
              </h2>
              {projData.map((project) => (
                <Link key={project.project_id} to={`/project/${project.project_id}`}>
                  <h3>{project.name}</h3>
                  {' '}
                </Link>
              ))}
            </Box>
            <Box align="left" justify="center" border round pad="medium">

              {/* Area designated for pending invites, onclick the invite is accepted and the user is redirected to that project page */}
              <h2>Your Invites</h2>

              <h2>
                <Inbox color="accent-3" />
                {' '}
                Your Invites
              </h2>

              {invites.length > 0 ? invites.map((invite) => (
                <>
                  <Box>
                    <b>{invite.project_name}</b>
                    <Text>
                      from
                      {' '}
                      {invite.invited_by}
                    </Text>
                  </Box>
                  <Box direction="row" gap="small" align="center" justify="center">
                    <Button
                      key={invite.id}
                      onClick={async () => {
                        await fetch(`/accept/${invite.project_id}`);
                        navigate(`/project/${invite.project_id}`);
                      }}
                    >
                      <FormCheckmark color="green" />
                    </Button>
                    <Button
                      key={invite.id}
                      onClick={async () => {
                        await fetch(`/decline/${invite.project_id}`);
                        window.location.reload(false);
                      }}
                    >
                      <FormClose color="red" />
                    </Button>
                  </Box>

                </>
              )) : <h3>You have no invites</h3>}
            </Box>
            <CreateProject />
          </Box>
          <Box>
            <h2>
              <Schedule color="accent-2" />
              {' '}
              Your Calendar
            </h2>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              height={550}
              aspectRatio={1}
              displayEventEnd
              eventDidMount={colorCode}
              events={data}
              eventClick={show}
            />
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}
