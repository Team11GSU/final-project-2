import { Box, Nav } from "grommet";
import { Outlet, Link, useParams } from 'react-router-dom';
import useUser from "./utils/useUser";

export default function App() {
    const { isLoading, userData } = useUser()
    const params = useParams();
    if (isLoading) {
        return <h1>Loading....</h1>
    } else {
        return (
            <Box>
                {userData != null && (
                    <>Hello {userData.google_data.email}<p>Click <a href="/logout">here</a> to log out</p></>

                )}
                <Nav direction="row" pad="medium">
                    <Link to={`/project/${params.projectID}/chat`}>Chat</Link>
                    <Link to={`/project/${params.projectID}/calendar`}>Calendar</Link>
                    <Link to={`/project/${params.projectID}/todo`}>Todo</Link>
                    <Link to={`/project/${params.projectID}/files`}>Files</Link>
                </Nav>
                <Outlet />
            </Box>
        )
    }
}
