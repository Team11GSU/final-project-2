import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

export default function Calendar() {
    const params = useParams();
    const [data, setData] = useState([])
    const [title, setTitle] = useState("");
    const [sDate, setSDate] = useState("");
    const [eDate, setEDate] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        fetch(`/${params.projectID}/getEvent`)
            .then((response) => response.json())
            .then((cdata) => {
                console.log(cdata)
                setData(cdata.map(elem => { return { title: elem.title, date: elem.sDate } }))
            })
    }, []);

    function handleSubmit(e) {
        e.preventDefault()
        fetch(`/${params.projectID}/addEvent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    title: title,
                    sDate: sDate,
                    eDate: eDate,
                    category: category,
                    description: description,
                }
            ),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setData(data.map(elem => { return { title: elem.title, date: elem.sDate } }))
            })
    }

    return (

        <>
            <h1>Calendar Page</h1>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                height={550}
                aspectRatio={1}
                events={data}
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