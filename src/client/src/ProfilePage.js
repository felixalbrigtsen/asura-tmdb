import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Appbar from "./components/AsuraBar";
import LoginPage from "./LoginPage";
import ErrorSnackbar from "./components/ErrorSnackbar";
import { Button, TextField, Stack, InputLabel, Select, Container, Slider, Paper, Box, Grid, Typography } from '@mui/material';

export default function ProfilePage(props) {
    let user = props.user;

    if (!props.user.isLoggedIn) { return <LoginPage user={props.user} />; }

    return (<>
        <Appbar user={props.user} pageTitle="Profile" />
        <Container sx={{minHeight: "30vh", width: "90vw", padding: "20px 20px"}} component={Container} direction="column" align="center">
            <Paper sx={{minHeight: "30vh", width: "90vw", margin: "10px auto"}} component={Stack} direction="column" justifyContent="center">
                <div align="center">
                <h2><b>Your profile</b></h2>
                <Box>
                    <h3><b>Name: </b> {user.name}</h3>
                    <h3><b>Email: </b> {user.email}</h3>
                    <h3><b>Role: </b> {user.isManager ? "Manager" : "Administrator"}</h3>
                </Box>
                </div>
            </Paper>
        </Container>
    </>)
}