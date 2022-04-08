import React, { useState } from "react";
import { Box, Button, Form, FormField, TextInput } from 'grommet';


const TodoForms = ({ addItem }) => {
    const [userInput, setUserInput] = useState();
    const onChange = (e) => {
        setUserInput(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = {
            id: Math.random(), TaskName: userInput, complete: false
        }
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