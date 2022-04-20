/* eslint linebreak-style: ["error", "windows"] */
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Outlet, Link } from 'react-router-dom';
import {
  Nav, Card, CardBody, CardHeader, Box,
} from 'grommet';
import useUser from './utils/useUser';

export default function UserProfile() {
  const [data, setData] = useState([]);
  const [projData, setProjData] = useState([]);
  const { userData } = useUser();

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
          projectID: elem.project_id,
        })));
      });
  }, []);

  useEffect(() => {
    fetch('/getUserProjects')
      .then((response) => response.json())
      .then((pdata) => {
        // console.log(cdata);
        setProjData(pdata);
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

  return (
    <>
      <div>
        {/* Page where a list of your projects will be displayed as well as a calendar that shows are of your events */}
        <Box pad="large">
          {/* Checks that there is a user currently logged in through the Google Login flow */}
          <h1>User Profile Page </h1>
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
            </>

          )}
        </Box>

      </div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height={550}
        aspectRatio={1}
        displayEventEnd
        events={data}
        eventClick={show}
      />

      <Box overflow="auto" align="left" justify="left">
        <Card
          background="light-1"
        >
          <CardHeader pad="medium" align="left"><h1>Your Projects</h1></CardHeader>
          <CardBody pad="small">
            <Nav direction="column" pad="medium">
              {projData.map((project) => (
                <Link to={`/project/${project.project_id}`}>
                  <h2>{project.name}</h2>
                  {' '}
                </Link>
              ))}
            </Nav>
            <Outlet />
          </CardBody>
        </Card>
      </Box>
    </>
  );
}
