import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes, useParams } from "react-router-dom";
import Appbar from "./components/AsuraBar";
import ErrorSnackbar from "./components/ErrorSnackbar";

import {Button, Box, TextField, Stack, InputLabel, Paper, TableContainer, Table, TableBody, TableHead, TableCell, TableRow, Typography} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function showError(error) {
    alert("Something went wrong. \n" + error);
    console.error(error);
}

function AdminCreator(props){
    function postCreate(){
        let adminEmail = document.getElementById("adminEmailInput").value;
        if (!adminEmail) {
            showError("Admin email is required");
            return;
        }
    

    let formData = new FormData();
    formData.append("email", adminEmail)
    let body = new URLSearchParams(formData)

    fetch(process.env.REACT_APP_API_URL + `/users/createBlank`, {
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
                <TextField id="adminEmailInput" sx={{ width: "70%" }} label="Admin Email" variant="outlined" type="email" />
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

function UserList(props){
    const deleteUsers = userId => {
        fetch(process.env.REACT_APP_API_URL + `/users/${userId}`, {method: "DELETE"})
            .then(res => res.json())
            .then(data => {
                if(data.status !== "OK"){
                    showError(data.data);
                    return;
                }
                props.setUsers(props.users.filter(user => user.id !== userId));
            })
            .catch(error => showError(error));
    }

    return(
        <Paper sx={{minHeight: "30vh", width:"90vw", margin:"10px auto"}} component={Stack} direction="column" justifycontent="center">
            <div align="center">
            {/* TODO: scroll denne menyen, eventuelt søkefelt */}
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rank</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.users.map((user) => (
                            <TableRow key={user.id}>
                            <TableCell component="th" scope="row"> 
                            <b>
                              {user.name}
                            </b>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            {/* TODO Drop down menu for selecting rank */}
                            <TableCell>{'user.rank'}</TableCell>
                            {/* <TableCell align="right">{team.members}</TableCell> */}
                            <TableCell align="center">
                              {/* <Button variant="contained" sx={{margin: "auto 5px"}} color="primary" onClick={() => props.setSelectedTeamId(team.id)} endIcon={<EditIcon />}>Edit</Button> */}
                              <Button variant="contained" sx={{margin: "auto 5px"}} color="error" onClick={() => {deleteUsers(user.id)}} endIcon={<DeleteIcon />}>Delete</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Paper>
    )
}

export default function Users(props) {
    const [users, setUsers] = React.useState([]);
    const { userId } = useParams();

    function getUsers() {
        fetch(process.env.REACT_APP_API_URL + `/users/getUsers`)
            .then((res) => res.json())
            .then((data) =>{
                if(data.status !== "OK") {
                    showError(data.data);
                }
                setUsers(data.data);
            })
            .catch((err) => showError(err));
        } 
        React.useEffect(() => {
            getUsers()
        }, []);

        return (
            <>
            <Appbar pageTitle="Admins" />
            <div className="admins">
                <AdminCreator />
                <UserList users={users}/>
            </div>
            </>
        );
}