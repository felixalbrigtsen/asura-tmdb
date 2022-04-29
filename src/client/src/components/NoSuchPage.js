import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { Typography, Paper, Stack } from '@mui/material'
import Appbar from './AsuraBar'

export default function NoSuchPage(props) {
    return (
    <>
    <Appbar user={props.user} pageTitle={"Page not found"} />
    <Paper sx={{minHeight: "30vh", width: "90vw", margin: "10px auto"}} component={Stack} direction="column" justifyContent="center">
        <div align="center">
        <Typography type="h2">
            This page does not exist
        </Typography>
        <Typography type="h3">
            The page you are looking for does not exist or has been moved
        </Typography>
        <Link to="/">
            Return to the home page
        </Link>
        </div>
    </Paper>
    </>
    );
}