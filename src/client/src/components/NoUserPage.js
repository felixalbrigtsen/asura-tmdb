import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { Typography, Paper, Stack } from '@mui/material'
import Appbar from './AsuraBar'

export default function NoUserPage(props) {
    return (
    <>
    <Appbar user={props.user} pageTitle={"Invalid User"} />
    <Paper sx={{minHeight: "30vh", width: "90vw", margin: "10px auto"}} component={Stack} direction="column" justifyContent="center">
        <div align="center">
        <Typography type="h2">
            You are not logged in
        </Typography>
        <Typography type="h3">
        Your account is not in the administrators list. Try again with another account here: <Link to="/login">Login</Link>
        or 
        <Link to="/"> Return to the home page</Link>
        </Typography>
        </div>
    </Paper>
    </>
    );
}