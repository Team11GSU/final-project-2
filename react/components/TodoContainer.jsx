import React, { useState } from "react";
import TodoTask from './TodoItem';
import TodoForms from './TodoForms';
import { useParams } from 'react-router-dom';



const TodoItem = [
    {
        id: 1,
        TaskName: 'my first task',
        complete: true,
        
    },
]

const TodoContainer = () => {
    const [todoList, setTodoList] = useState(TodoItem);
    const handleAddItem = (userInput) => {
        const item = [...todoList, userInput];
        setTodoList(item);
    }

    const handleClick = (id) => {
        const item = todoList.map(todo => {
            if (todo.id == id) {
                return { ...todo, complete: !todo.complete }
            }
            return todo;
        })
        setTodoList(item)
    }

    const handleDelete = (id) => {
        let item = todoList.filter(todo =>
            todo.id !== id
        );
        setTodoList(item)

    }

    return (
        <div>
            {todoList.length > 0 ? todoList.map(
                (todo) => <TodoTask todo={todo} key={todo.id} deleteTodo={handleDelete}handleChange={handleClick} />) : <p>your task is clean</p>}

            <TodoForms addItem={handleAddItem} />

        </div>
    )
}

export default TodoContainer