import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import AppBar from "./components/AsuraBar";
import ErrorSnackbar from "./components/ErrorSnackbar";
import { Button, TextField, Stack, InputLabel, Select, Container, Slider, Paper, Box, Grid, Typography } from '@mui/material';

export default function ProfilePage(props) {
    if (!props.login) {
        return <h1>Something went very wrong</h1>
    }
    console.log(props.login.user);
    return (<>
        <AppBar pageTitle="Profile" />
        <Container sx={{minHeight: "30vh", width: "90vw", padding: "20px 20px"}} component={Container} direction="column" align="center">
            {props.login.isLoggedIn ? <>
                <Box sx={{ padding: "20px", width: "90vw", height: "30vh", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", alignContent: "center", flexGrow: 1}}>
                  
                </Box>
            </>:<>
                <Box sx={{ padding: "20px", width: "90vw", height: "30vh", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", alignContent: "center", flexGrow: 1}}>
                    You are not logged in.
                </Box>
            </>}

        </Container>
    </>)
}