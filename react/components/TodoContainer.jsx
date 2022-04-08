import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

  const handleDelete = (id) => {
    fetch(`/todo/${id}/delete`, { method: 'POST' });
    const item = todoList.filter((todo) => todo.id !== id);
    setTodoList(item);
  };

  return (
    <div>
      {todoList.length > 0 ? todoList.map(
        (todo) => <TodoTask todo={todo} key={todo.id} deleteTodo={handleDelete} handleChange={handleClick} />,
      ) : <p>your task is clean</p>}

      <TodoForms setTodoList={setTodoList} />

    </div>
  );
}

export default TodoContainer;
