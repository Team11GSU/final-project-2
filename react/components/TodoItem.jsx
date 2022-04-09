/* eslint-disable react/prop-types */
import React from 'react';
import { CheckBox } from 'grommet';

function TodoTask({ todo, deleteTodo, handleChange }) {
  const handleClick = () => {
    handleChange(todo.id);
  };
  return (
    <div className="CheckboxItem">
      {/* Grommet Checkbox is used to indicate the current status of
      the corresponding todo item which is followed by the name of the todo task */}
      <CheckBox checked={todo.complete} onChange={() => handleClick()} />
      <span value={todo.id}>{todo.TaskName}</span>
      <span
        style={{ position: 'fixed', right: 20, cursor: 'pointer' }}
        /* On click the todo item is removed from the list */
        onClick={() => { deleteTodo(todo.id); }}
        aria-hidden="true"
      >
        delete
      </span>
      <hr />
    </div>
  );
}

export default TodoTask;
