import { Box, Nav, Form, FormField, TextInput, Button } from "grommet";
import { Outlet, Link, useParams } from 'react-router-dom';
import useUser from "./utils/useUser";
import { useState } from "react"

export default function App() {
    const [value, setValue] = useState({});
    const { isLoading, userData } = useUser()
    const params = useParams();
    if (isLoading) {
        return <h1>Loading....</h1>
    } else {
        return (
            <Box>
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
