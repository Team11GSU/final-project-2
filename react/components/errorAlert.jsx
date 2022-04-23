import {
  Box, Layer,
} from 'grommet';
import { Close } from 'grommet-icons';
import PropTypes from 'prop-types';

export default function ErrorAlert({ message, setError }) {
  return (
    <Layer position="center" onClickOutside={() => setError(false)}>
      <Box align="center" justify="center" height="small" overflow="auto">
        <Box align="center" justify="center" pad="xlarge" direction="row" gap="small">
          {message}
          <Close alignSelf="left" onClick={() => setError(false)} color="red" />
        </Box>
      </Box>
    </Layer>
  );
}

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired,
};
