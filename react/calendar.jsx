/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState } from 'react';
import {
  Button, Form, TextInput, TextArea, Select, Box, Grid, Text,
} from 'grommet';
import { useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ScheduleNew } from 'grommet-icons';
import ErrorAlert from './components/errorAlert';
import CalendarAlert from './components/calendarAlert';

export default function Calendar() {
  /* useParams is used to ensure that the calendar
      that is displayed matches that of the projectID that is passed in the endpoint */
  const params = useParams();
  const [error, setError] = useState(false);
  const [showEvent, setShow] = useState(false);
  const [eventData, setEventData] = useState({});

  /* useState is used so that our variable are preserved through the application
      and also serves to set the appropriate data into its respective variable */
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [sDate, setSDate] = useState('');
  const [eDate, setEDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Event');
  /* useEffect is used so that anytime a new event is added to
      the calendar, the fetch is called again and the new event is rendered to the screen  */
  useEffect(() => {
    fetch(`/${params.projectID}/getEvent`)
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

  /* This function is used for the submission of the form
        A post request is used to send the form data to the REST API that was created in api.py
        A map is used to loop through the data and store it in the appropriate parameter
        The user is notified that the event has successfully been added to the calendar
        And the form is cleared on submission */
  function handleSubmit(e) {
    e.preventDefault();
    fetch(`/${params.projectID}/addEvent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          title,
          sDate,
          eDate,
          category,
          description,
        },
      ),
    })
      .then((response) => response.json())
      .then((cdata) => {
        // console.log(data);
        setError(true);
        setData(cdata.map((elem) => ({
          title: elem.title,
          start: elem.sDate,
          end: elem.eDate,
          description: elem.description,
          category: elem.category,
        })));
      });
    setTitle('');
    setSDate('');
    setEDate('');
    setDescription('');
    setCategory('Event');
  }

  // Function to display the details of the clicked event using a window alert
  function show(info) {
    setEventData({
      Title: info.event.title,
      Description: info.event.extendedProps.description,
      StartDate: info.event.start.toLocaleDateString(),
      EndDate: info.event.end?.toLocaleDateString(),
      Category: info.event.extendedProps.category,
    });
    setShow(true);
  }

  // Checks for the 'category' of an event and assigns
  // the corresponding color to be displayed on the calendar
  function colorCode(arg) {
    if (arg.event.extendedProps.category === 'Event') {
      // Events are colored green
      arg.el.style.backgroundColor = '#059849';
    } else {
      // Deadlines are colored red
      arg.el.style.backgroundColor = '#980505';
    }
  }

  return (

    <Box direction="row" align="center" justify="center">
      {/* The FullCalendar parent component is called with props to adjust what the calendar will
      look like once rendered. With the event prop, the json data that was stored in 'data' is
      looped through displaying all unique events that have been created. The eventClick prop
      serves to create a pop-up box when the user clicks on an event on the calendar.
      After which they will be able to see all of the relavant data for that particular event */}
      <Grid columns={['large', 'medium']} gap="small">
        <Box>
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
        <Box align="center" justify="center">
          {/* Standard form that is used to send the user's input to the REST API
            On submission, having clicked the submit button, the handleSubmit
            function is called to handle that POST request */}
          <Form onSubmit={handleSubmit}>
            <Box align="center" justify="center" gap="xsmall">
              <TextInput type="text" label="Title: " value={title} placeholder="Enter Title" required onChange={(e) => setTitle(e.target.value)} />
              <TextInput type="text" label="Start Date: " value={sDate} placeholder="Start Date (yyyy-mm-dd)" required onChange={(e) => setSDate(e.target.value)} />
              <TextInput type="text" label="End Date: " value={eDate} placeholder="End Date (yyyy-mm-dd)" onChange={(e) => setEDate(e.target.value)} />
              <TextArea type="text" label="Description: " value={description} placeholder="Enter Description" onChange={(e) => setDescription(e.target.value)} />
              <Select
                label="Category: "
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={['Event', 'Deadline']}
              />

              <Button type="submit">
                <Box direction="row" gap="xsmall" alignSelf="end" align="center" justify="center">
                  <Text color="purple">Add to Agenda</Text>
                  {' '}
                  <ScheduleNew color="purple" />
                </Box>
              </Button>
            </Box>
          </Form>
        </Box>
      </Grid>
      {error && <ErrorAlert message="New Event Saved!" setError={setError} />}
      {showEvent && <CalendarAlert data={eventData} setError={setShow} />}
    </Box>

  );
}
