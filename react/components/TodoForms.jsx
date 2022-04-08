import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Box, Button, Form, FormField, TextInput } from 'grommet';


const TodoForms = ({ addItem }) => {
    const params = useParams();
    const [userInput, setUserInput] = useState();
    const onChange = (e) => {
        setUserInput(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = {
            id: Math.random(), TaskName: userInput, complete: false
        }
        fetch('todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    TaskName: TaskName,
                    complete: complete,
                }
            ),
        }).then((response) => response.json())
            .then((newItem) => {
                setUserInput(newItem)
            });
        addItem(newItem);
        setUserInput("");
    }

    return (
        <div className="TodoForm">
            <Form onSubmit={handleSubmit}>

                <TextInput type="text" value={userInput} name="name" onChange={onChange} placeholder="Enter your Task" required />

                <Button type="submit" label="Submit" primary />
            </Form>
        </div>

    );
}

export default TodoForms;