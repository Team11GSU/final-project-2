import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Outlet, Link } from 'react-router-dom';
import { Nav } from 'grommet';

export default function UserProfile() {
  const [data, setData] = useState([]);
  const [projData, setProjData] = useState([]);

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

  return (
    <>
      <div>
        {/* Page where a list of your projects
        will be displayed as well as a calendar that shows are of your events */}
        <h2>User Profile Page </h2>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height={550}
        aspectRatio={1}
        displayEventEnd
        events={data}
      />

      <h2>Your Projects: </h2>
      <Nav direction="row" pad="medium">
        {projData.map((project) => (
          <Link to={`/project/${project.project_id}`}>
            <h3>{project.name}</h3>
            {' '}
          </Link>
        ))}
      </Nav>
      <Outlet />
    </>
  );
}
