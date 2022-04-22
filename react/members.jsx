/* eslint-disable react/prop-types */
import {
  Table, TableHeader, TableRow, TableCell, TableBody, Box,
} from 'grommet';

export default function Members({ projData }) {
  //Displays the names of all of the members of the project along with their e-mail address
  return (
    <Box width="large" pad="xsmall">
      <Table width="medium">
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
          <TableRow>
            <TableCell scope="row">
              {projData.map((member) => (
                <h5>
                  {member.name}
                </h5>
              ))}
            </TableCell>
            <TableCell>
              {projData.map((member) => (
                <h5>
                  {member.email}
                </h5>
              ))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}
