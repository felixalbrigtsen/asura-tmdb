import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import AppBar from "./components/AsuraBar";
import ErrorSnackbar from "./components/ErrorSnackbar";

import {Button, Textfield, Stack, InputLabel, Paper, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons/Delete';

function showError(error) {
    alert("Something went wrong. \n" + error);
    console.error(error);
}

function AdminCreator(props){
    function postCreate(){
        let adminEmail = document.getElementById("adminEmailInput").value;
        if (!adminName) {
            showError("Admin email is required");
            return;
        }
    

    let formData = new FormData();
    formData.append("name", teamName)
    let body = new URLSearchParams(formData)

    fetch(process.env.REACT_APP_API_URL + `/admins/create`, {
        method: "POST",
        body: body
        })
        .then(res => res.json())
        .then(data => {
            if (data.status !== "OK") {
                showError(data.data);
                return;
            }
            document.getElementById("adminEmailInput").value = "";
            props.onAdminCreated();
        }
        )
    }

    return (
        <Paper sx={{width: "90vw", margin: "10px auto", padding: "15px"}} component={Stack} direction="column">
            <div align="center">
                <TextField id="adminEmailInput" sx={{ width: "70%" }} label="Admin Email" variant="outlined" />
                {/* <Button variant="contained" color="primary" onClick={postCreate}>Create Team</Button> */}
                <Button variant="contained" color="success" onClick={postCreate} sx={{width: "20%", marginLeft: "5px"}}>
                    <Box sx={{padding: "10px"}}>
                        Create Admin
                    </Box>
                    <AddCircleIcon />
                </Button>
            </div>
        </Paper>
    )
}

function AdminList(props){
    const deleteAdmin = adminId => {
        fetch(process.env.REACT_APP_API_URL)
}