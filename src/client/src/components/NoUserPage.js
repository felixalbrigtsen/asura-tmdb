import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { Typography } from '@mui/material'

export default function NoSuchPage() {
    return(
    <>
        <Typography type="h3">
            You are not logged in
        </Typography>
        <Typography type="h4">
            You dont have access to this page, you can log in here: <Link to="/login">Login</Link>
        </Typography>
        <Link to="/">
            Return to the home page
        </Link>
    </>
    )
}