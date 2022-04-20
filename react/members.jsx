import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Nav } from 'grommet';


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
        <><div>
            {/* Page where a list of your current project's members will be displayed */}
            <h1>Members Page </h1>
        </div>
            <h2>Projects Members: </h2>
            <Nav direction="column" pad="medium">
                {projData.map((member) => (
                    <h3>Name: {member.name} Email: {member.email}</h3>
                ))}
            </Nav>
            <Outlet />
        </>
    );
}