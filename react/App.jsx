import { Box, Nav } from "grommet";
import { Outlet, Link, useParams } from 'react-router-dom';
import useUser from "./utils/useUser";

export default function App() {
    const { isLoading, userData } = useUser()
    // useParams is used to ensure that the pages that displayed correspond to the current project that the user is operating in 
    const params = useParams();
    if (isLoading) {
        // While the page checks for a logged in user it displays a 'loading' message to indicate that it is in the process 
        return <h1>Loading....</h1>
    } else {
        return (
            <Box>
                {/* Checks that there is a user currently logged in through the Google Login flow */}
                {userData != null && (
                    <>Hello {userData.google_data.email}<p>Click <a href="/logout">here</a> to log out</p></>

                )}
                {/* Clickable links that take the user to the corresponding pages */}
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
