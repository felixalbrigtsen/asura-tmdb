import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import AppBar from "./components/AsuraBar";
import ErrorSnackbar from "./components/ErrorSnackbar";

import {Button, Textfield, Stack, InputLabel, Paper, Typography} from '@mui/material';


export default function LoginPage() {
    return (
        <>
            <AppBar pageTitle="Sign in" />
            <h2>Sign in with google</h2>
            <a href={process.env.REACT_APP_LOGIN_URL}>
                <img src="/btn_google_signing_dark.png" alt="Sign in with google" />
            </a>
        </>
    );
}