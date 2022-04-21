import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from 'grommet';
import TodoTask from './TodoItem';
import TodoForms from './TodoForms';

// const TodoItem = [
//   {
//     id: 1,
//     TaskName: 'my first task',
//     complete: true,
//   },
// ];

function TodoContainer() {
  const params = useParams();
  const [todoList, setTodoList] = useState([]);
  //   const handleAddItem = (userInput) => {
  //     const item = [...todoList, userInput];
  //     setTodoList(item);
  //   };

  const getTodos = () => fetch(`/todo/${params.projectID}`)
    .then((resp) => resp.json())
    .then((todos) => setTodoList(todos));

  // useEffect is used to get todo items whenever a new item is added
  useEffect(() => {
    getTodos();
  }, []);

  const handleClick = (id) => {
    fetch(`/todo/${id}/toggle`, { method: 'POST' });
    const item = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, complete: !todo.complete };
      }
      return todo;
    });
    setTodoList(item);
  };

  // removes the todo item from the database using a POST request and the id
  const handleDelete = (id) => {
    fetch(`/todo/${id}/delete`, { method: 'POST' });
    const item = todoList.filter((todo) => todo.id !== id);
    setTodoList(item);
  };

  return (
    <Box gap="xsmall">
      {/* A map is used to print all of the todo items that were fetched
       If there are no todo items currently, a message is displayed to indicate that
       This is also where the handleDelete and handleClick functions are called */ }
      {todoList.length > 0
        ? <h1>Project Todos</h1>
        : <h1>This project has no to-dos currently...</h1>}
      {todoList.map(
        (todo) => (
          <TodoTask
            todo={todo}
            key={todo.id}
            deleteTodo={handleDelete}
            handleChange={handleClick}
          />
        ),
      )}
      {/* TodoForms component is used to get the user inputs */}
      <TodoForms setTodoList={setTodoList} />

    </Box>
  );
}

export default TodoContainer;
