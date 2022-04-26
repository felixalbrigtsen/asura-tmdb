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
        Your account is not in the administrators list. Try again with another account here: <Link to="/login">Login</Link>
        or 
        <Link to="/"> Return to the home page</Link>
        </Typography>
    </>
    )
}