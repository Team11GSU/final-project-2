import React from 'react';
import {
  CheckBox, Text, Box, Button,
} from 'grommet';
import { Erase } from 'grommet-icons';
import PropTypes from 'prop-types';

function TodoTask({ todo, deleteTodo, handleChange }) {
  const handleClick = () => {
    handleChange(todo.id);
  };
  return (
    <Box direction="row" align="center" justify="between" pad="medium" border round>
      {/* Grommet Checkbox is used to indicate the current status of
      the corresponding todo item which is followed by the name of the todo task */}
      <CheckBox label={todo.TaskName} checked={todo.complete} onChange={() => handleClick()} />

      <Button secondary onClick={() => { deleteTodo(todo.id); }}>
        <Box direction="row" gap="xsmall" alignSelf="end" align="center" justify="center">
          <Text color="pink">Remove</Text>
          {' '}
          <Erase color="pink" />
        </Box>
      </Button>

    </Box>
  );
}

TodoTask.propTypes = {
  todo: PropTypes.shape({
    TaskName: PropTypes.string,
    complete: PropTypes.bool,
    id: PropTypes.number,
  }).isRequired,
  deleteTodo: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default TodoTask;
