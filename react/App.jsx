import { Box, Nav, Form, FormField, TextInput, Button } from "grommet";
import { Outlet, Link, useParams } from 'react-router-dom';
import useUser from "./utils/useUser";
import { useState } from "react"

export default function App() {
    const [value, setValue] = useState({});
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
                    <>
                        Hello {userData.google_data.email}<p>Click <a href="/logout">here</a> to log out</p>
                        <Form
                            value={value}
                            onChange={nextValue => setValue(nextValue)}
                            onReset={() => setValue({})}
                            onSubmit={({ value }) => {
                                fetch("/email", {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(value),
                                }).then(resp => alert("Email will be sent."))
                            }
                            }>
                            <FormField name="email" htmlFor="text-input-id" label="Send Email">
                                <TextInput id="text-input-id" name="email" />
                            </FormField>
                            <Box direction="row" gap="medium">
                                <Button type="submit" primary label="Submit" />
                                <Button type="reset" label="Reset" />
                            </Box>
                        </Form>
                    </>

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
