import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import {
  Table, TableHeader, TableRow, TableCell, TableBody,
} from 'grommet';
import useUser from './utils/useUser';

export default function CreateProject() {
  const [projData, setProjData] = useState([]);
  const params = useParams();
  const { userData } = useUser();

  useEffect(() => {
    fetch('/createproject')
      .then((response) => response.json())
      .then((pdata) => {
        setProjData(pdata);
      });
  }, []);

  return (
    <>
      <div>
        {/* Page where a list of your current project's members will be displayed */}
        <h1>Project Creation Page </h1>
        {userData != null && (
        <>
          Hello
          {' '}
          {userData.google_data.name}
          <p>
            Click
            {' '}
            <a href="/logout">here</a>
            {' '}
            to log out of
            {' '}
            {userData.google_data.email}
          </p>
        </>

        )}
      </div>
      <h2>Invite Users: </h2>
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
