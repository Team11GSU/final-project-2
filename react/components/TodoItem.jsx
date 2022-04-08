import React from 'react';
import { Box, CheckBox } from 'grommet';

const TodoTask = ({ todo, deleteTodo, handleChange }) => {
    const handleClick = () => {
        if (todo.complete) return null;
        handleChange(todo.id)
    }
    return (
        <div className='CheckboxItem'>
            <CheckBox checked={todo.complete} onChange={() => handleClick()} />
            <span value={todo.id}>{todo.TaskName}</span>
            <span style={{ position: "fixed", right: 20, cursor: "pointer" }}
                onClick={() => { deleteTodo(todo.id) }}>delete</span>
            <hr />
        </div>
    )
}

export default TodoTask;