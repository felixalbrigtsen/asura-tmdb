import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import AppBar from "./components/AsuraBar";
import ErrorSnackbar from "./components/ErrorSnackbar";
import { Button, TextField, Stack, InputLabel, Select, Container, Slider, Paper, Box, Grid, Typography } from '@mui/material';

export default function ProfilePage(props) {
    let user = props.user;
    return (<>
        <AppBar pageTitle="Profile" />
        <Container sx={{minHeight: "30vh", width: "90vw", padding: "20px 20px"}} component={Container} direction="column" align="center">
            {user.isLoggedIn ? <>
                <Paper sx={{minHeight: "30vh", width: "90vw", margin: "10px auto"}} component={Stack} direction="column" justifyContent="center">
                    <div align="center">
                    <h2><b>Your profile</b></h2>
                    <Box>
                        <h3><b>Name: </b> {user.name}</h3>
                        <h3><b>Email: </b> {user.email}</h3>
                        <h3><b>Role: </b> {props.login.isManager() ? "Manager" : "Administrator"}</h3>
                        <h3><b>Picture: </b> <img src={user.imgURL} alt="Your profile"></img></h3>
                    </Box>
                    </div>
                </Paper>
            </> : <>
                <Box sx={{ padding: "20px", width: "90vw", height: "30vh", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", alignContent: "center", flexGrow: 1}}>
                    You are not logged in.
                </Box>
            </>}

        </Container>
    </>)
}