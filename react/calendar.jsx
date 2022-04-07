import React from 'react'
import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

export default function Calendar() {
    const [title, setTitle] = useState([]);
    const [sDate, setSDate] = useState([]);
    const [eDate, setEDate] = useState([]);
    const [description, setDescription] = useState([]);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        fetch('/<projectID>/getEvent',
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.json()).then((data) => {
                setTitle(data.title);
                setSDate(data.sDate);
                console.log(data)
            })
    }, []);

    function handleSubmit() {
        fetch('/<projectID>/addEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    title: title,
                    sDate: sDate
                }
            ),
        }).then((response) => response.json()).then((data) => {
            console.log(data)
            console.log('Data goes here')
        })
        window.alert('Event added!');
    }

    return (

        <>
            <h1>Calendar Page</h1>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                height={550}
                aspectRatio={1}
                events={[
                    { title: 'Test Event', date: '2022-04-15' }
                ]}
            />

            <form onSubmit={handleSubmit}>
                <label>Title: </label>
                <input type="text" value={title} placeholder="Enter Title" onChange={(e) => setTitle(e.target.value)} /><br></br>

                <label>Start Date: </label>
                <input type="text" value={sDate} placeholder="YYYY-MM-DD" onChange={(e) => setSDate(e.target.value)} /><br></br>

                <label>End Date: </label>
                <input type="text" value={eDate} placeholder="YYYY-MM-DD" onChange={(e) => setEDate(e.target.value)} /><br></br>

                <label>Description: </label>
                <input type="text" value={description} placeholder="Enter Event Description" onChange={(e) => setDescription(e.target.value)} /><br></br>

                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Event">Event</option>
                    <option value="Deadline">Deadline</option>
                </select><br></br>

                <button type='submit'>Add Event</button>



            </form>

        </>


    )
}