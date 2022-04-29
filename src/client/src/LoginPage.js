import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Appbar from "./components/AsuraBar";

import { Stack, Paper, Typography} from '@mui/material';

export default function LoginPage(props) {
    if (props.user.isLoggedIn) {
        // Redirect to the front page if the user is logged in
        window.location.href = "/";
        return;
    }
    
    return (
        <>
            <Appbar user={props.user} pageTitle="Login" /> 
            <Paper sx={{width: "70vw", margin: "1.5% auto", padding: "25px"}} component={Stack} direction="column" justifyContent="center" alignItems="center">
                <Stack  direction="column" paddingTop={'0.5%'} alignItems={'center'} textAlign={"center"} >
                    <Typography variant="h4" component="h4">
                        You must be logged in to access administrator features.
                    </Typography>
                    <a href={process.env.REACT_APP_LOGIN_URL}>
                        <img src="/btn_google_signing_dark.png" alt="Sign in with google" />
                    </a>
                </Stack>
            </Paper>            
        </>
    );
}