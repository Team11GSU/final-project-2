/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button, Form, TextInput, Box, Text,
} from 'grommet';
import { Edit } from 'grommet-icons';
// This files uses the same fetch POST convention as other files to
// send the todo items to the database when they are submitted
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

    <Box
      style={{
        position: 'absolute',
        bottom: '10px',
        width: '80%',
      }}
      round="small"
      border
    >
      <Form onSubmit={handleSubmit}>
        <Box round="small" background="white" pad="small" direction="row" gap="10px" align="stretch" justify="around">
          <TextInput type="text" value={userInput} name="name" onChange={onChange} placeholder="Enter your Task" required />
          <Button type="submit">
            <Box direction="row" gap="xsmall" alignSelf="end" align="center" justify="center">
              <Text color="orange">Add</Text>
              {' '}
              <Edit color="orange" />
            </Box>
          </Button>
        </Box>
      </Form>
    </Box>

  );
}

export default TodoForms;
