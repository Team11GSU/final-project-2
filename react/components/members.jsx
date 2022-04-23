import {
  Table, TableHeader, TableRow, TableCell, TableBody, Box,
} from 'grommet';
import PropTypes from 'prop-types';

export default function Members({ members }) {
  // Displays the names of all of the members of the project along with their e-mail address
  return (
    <Box width="large" pad="xsmall">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell scope="col" border="bottom">
              Member
            </TableCell>
            <TableCell scope="col" border="bottom">
              Email
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow>
              <TableCell scope="row">
                {member.name}
              </TableCell>
              <TableCell>
                {member.email}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

Members.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape(
    {
      email: PropTypes.string,
      name: PropTypes.string,
    },
  )).isRequired,
};
