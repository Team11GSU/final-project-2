import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import {
  Table, TableHeader, TableRow, TableCell, TableBody,
} from 'grommet';

export default function Members() {
  const [projData, setProjData] = useState([]);
  const params = useParams();

  useEffect(() => {
    fetch(`/${params.projectID}/getProjectMembers`)
      .then((response) => response.json())
      .then((pdata) => {
        setProjData(pdata);
      });
  }, []);

  return (
    <>
      <div>
        {/* Page where a list of your current project's members will be displayed */}
        <h1>Members Page </h1>
      </div>
      <h2>Projects Members: </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell scope="col" border="bottom">
              Name
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
      <Outlet />
    </>
  );
}
