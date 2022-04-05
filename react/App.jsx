import { Box } from "grommet";
import useUser from "./utils/useUser";

export default function App() {
    const { isLoading, userData } = useUser()
    return (
        <Box>
            {isLoading && <h1>Loading....</h1>}
            {userData != null && (
                <>{userData.google_data.email}<p>Click <a href="/logout">here</a> to log out</p></>

            )}
            {/* <div id="g_id_onload"
                data-client_id="943068681276-s5jsp0eek49mua8lho0n1nst7atmcleh.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="popup"
                data-login_uri="http://127.0.0.1:5000/login"
                data-auto_select="true"
                data-close_on_tap_outside="false">
            </div>

            <div className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="continue_with"
                data-size="large"
                data-logo_alignment="left">
            </div> */}
        </Box>
    )
}
