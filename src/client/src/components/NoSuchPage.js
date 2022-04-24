import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { Typography } from '@mui/material'

export default function NoSuchPage() {
    return(
    <>
        <Typography type="h3">
            This page does not exist
        </Typography>
        <Typography type="h4">
            The page you are looking for does not exist or has been moved
        </Typography>
        <Link to="/">
            Return to the home page
        </Link>
    </>
    )
}