import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import AppBar from "./components/AsuraBar";
import ErrorSnackbar from "./components/ErrorSnackbar";

import {Button, Textfield, Stack, InputLabel, Paper, Typography} from '@mui/material';


function ProfileView() {
    return "lol";
}

export default function LoginPage() {
    return (
        <>
            <AppBar pageTitle="Sign in" />
            <Paper x={{width: "70vw", margin: "1.5% auto"}} component={Stack} direction="column" justifyContent="center" alignItems="center">
                <Stack  direction="column" paddingTop={'0.5%'} alignItems={'center'}>
                    <Typography>Sign in with google</Typography>
                    <Link to={process.env.REACT_APP_LOGIN_URL}>
                        <img src="/btn_google_signing_dark.png" alt="Sign in with google" />
                    </Link>
                </Stack>
            </Paper>            
        </>
    );
}