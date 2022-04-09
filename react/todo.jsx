import React from 'react';
import TodoContainer from './components/TodoContainer';

export default function TodoPage() {
  return (
    <>
      <h1>Todo Page</h1>
      <div className="Todo-Container">
        {/* TodoContainer component is called to display the list of current todo items along with the form to add new ones */}
        <TodoContainer />
      </div>
    </>
  );
}
