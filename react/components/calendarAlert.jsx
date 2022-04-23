import {
  NameValueList, NameValuePair, Box, Layer,
} from 'grommet';
import PropTypes from 'prop-types';
import { Close } from 'grommet-icons';

export default function CalendarAlert({ data, setError }) {
  return (
    <Layer position="center" onClickOutside={() => setError(false)}>
      <Box align="center" justify="center" width="large" overflow="auto">
        <Box align="center" justify="center" pad="xlarge" gap="small">
          <Close onClick={() => setError(false)} color="red" />
          <Box align="center" justify="center" pad="xlarge" gap="small">
            <NameValueList>
              {Object.entries(data).map(([name, value]) => (
                <NameValuePair key={name ?? ''} name={name ?? ''}>
                  {value}
                </NameValuePair>
              ))}
            </NameValueList>
          </Box>
        </Box>
      </Box>
    </Layer>
  );
}

CalendarAlert.propTypes = {
  data: PropTypes.shape({
    Title: PropTypes.string,
    Description: PropTypes.string,
    StartDate: PropTypes.string,
    EndDate: PropTypes.string,
    Category: PropTypes.string,
  }), // Of(PropTypes.arrayOf(PropTypes.string))
  setError: PropTypes.func.isRequired,
};

CalendarAlert.defaultProps = {
  data: {
    Title: '',
    Description: '',
    StartDate: '',
    EndDate: '',
    Category: '',
  },
};
