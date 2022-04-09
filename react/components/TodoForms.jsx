import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Button, Form, FormField, TextInput,
} from 'grommet';
// This files uses the same fetch POST convention as other files to send the todo items to the database when they are submitted
function TodoForms({ setTodoList }) {
  const params = useParams();
  const [userInput, setUserInput] = useState();
  const onChange = (e) => {
    setUserInput(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/todo/${params.projectID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          TaskName: userInput,
        },
      ),
    }).then((response) => response.json())
      .then((todos) => {
        setTodoList(todos);
      });
    setUserInput('');
  };

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
