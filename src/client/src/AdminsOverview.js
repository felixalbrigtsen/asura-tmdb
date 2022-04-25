import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes, useParams } from "react-router-dom";
import Appbar from "./components/AsuraBar";
import ErrorSnackbar from "./components/ErrorSnackbar";
import LoginPage from "./LoginPage";
import { Button, Box, TextField, Stack, InputLabel, Paper, TableContainer, Table, TableBody, TableHead, TableCell, TableRow, Typography, Select, MenuItem, FormControl } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types'

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
                <form>
                    <TextField id="adminEmailInput" sx={{ width: "70%" }} label="Admin Email" variant="outlined" type="email" />
                    {/* <Button variant="contained" color="primary" onClick={postCreate}>Create Team</Button> */}
                    <Button type="submit" variant="contained" color="success" onClick={postCreate} sx={{width: "20%", marginLeft: "5px"}}>
                        <Box sx={{padding: "10px"}}>
                            Create Admin
                        </Box>
                        <AddCircleIcon />
                    </Button>
                </form>
            </div>
        </Paper>
    )
}

function UserList(props){
    const deleteUser = (userId) => {
      openConfirmDialog(function() { 
        fetch(process.env.REACT_APP_API_URL + `/users/${userId}`, {method: "DELETE"})
            .then(res => res.json())
            .then(data => {
                if(data.status !== "OK"){
                    showError(data.data);
                    console.log("UWU")
                    return;
                }
                props.onUserUpdated();
            })
            .catch(error => showError(error));
        });
    }

    let updateRank = (asuraId) => event => {
        event.preventDefault();
        let isManager = event.target.value === "manager";
        let formData = new FormData();
        formData.append("isManager", isManager);
        let body = new URLSearchParams(formData);
        fetch(process.env.REACT_APP_API_URL + `/users/${asuraId}/changeManagerStatus`, {
            method: "POST",
            body: body
        })
            .then(res => res.json())
            .then(data => {
                if(data.status !== "OK"){
                    showError(data.data);
                    return;
                }
                props.onUserUpdated();
            })
            .catch(error => showError(error));
    }

    return(
        <Paper sx={{minHeight: "30vh", width:"90vw", margin:"10px auto"}} component={Stack} direction="column" justifycontent="center">
            <div align="center">
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
                          <TableRow key={user.asuraId}>
                          <TableCell component="th" scope="row"> 
                          <b>
                            {user.name}
                          </b>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          {/* TODO Drop down menu for selecting rank */}
                          <TableCell>
                              <FormControl variant="standard">
                                  <Select onChange={updateRank(user.asuraId)} value={user.isManager ? "manager" : "admin"} label="rank" labelId="rankSelect" id="rankSelect">
                                      <MenuItem value={"manager"}>Manager</MenuItem>
                                      <MenuItem value={"admin"}>Admin</MenuItem>
                                  </Select>
                              </FormControl>
                          </TableCell>
                          {/* <TableCell align="right">{team.members}</TableCell> */}
                          <TableCell align="center">
                            {/* <Button variant="contained" sx={{margin: "auto 5px"}} color="primary" onClick={() => props.setSelectedTeamId(team.id)} endIcon={<EditIcon />}>Edit</Button> */}
                            <Button variant="contained" sx={{margin: "auto 5px"}} color="error" onClick={() => {deleteUser(user.asuraId)}} endIcon={<DeleteIcon />}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
              </Table>
            </div>
        </Paper>
    )
}

function ConfirmationDialogRaw(props) {
  const { userId } = useParams();
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleCancel = () => {
    onClose();
  };
  const handleConfirm = () => {
    onClose();
    props.handleconfirm();
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      keepMounted
    >
      <DialogTitle>Delete administrator?</DialogTitle>
      <DialogContent>
        Are you sure you want to delete the administrator? This action is not reversible!
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

// Confirmation window for "Delete user"
function openConfirmDialog(callback) {g_setDialogCallback(callback); g_setDialogOpen(true);}
let g_setDialogOpen = () => {};
let g_setDialogCallback = (callback) => {};

let showError = (message) => {};

export default function Users(props) {

    const [openError, setOpenError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    showError = (message) => {
        setOpenError(false);
        setErrorMessage(message);
        setOpenError(true);
    }
    const [users, setUsers] = React.useState([]);

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleDialogClose = () => { setDialogOpen(false); };
    const [dialogOnConfirm, setDialogOnConfirm] = React.useState(() => {return function(){}});
    g_setDialogCallback = (callback) => { setDialogOnConfirm(()=>{ return callback })};
    g_setDialogOpen = (value) => { setDialogOpen(value); };

    function getUsers() {
        fetch(process.env.REACT_APP_API_URL + `/users/getUsers`)
            .then((res) => res.json())
            .then((data) =>{
                if(data.status !== "OK") {
                    showError(data.data);
                    return;
                }
                setUsers(data.data);
            })
            .catch((err) => showError(err));
    } 
    React.useEffect(() => {
        getUsers()
    }, []);

    if (!props.user.isLoggedIn) { return <LoginPage user={props.user} />; }
    if (!props.user.isManager) {
        return (<>
            <Appbar user={props.user} pageTitle="Admins" />
            <Paper sx={{minHeight: "30vh", width:"90vw", margin:"10px auto", padding: "25px"}} component={Stack} direction="column" justifycontent="center">
            <div align="center">
                <Typography variant="h4">You do not have permission to view this page. If you believe this is incorrect, please contact a manager.</Typography>
            </div>
            </Paper>
        </>);
    }

    return (
        <>
        <Appbar user={props.user} pageTitle="Admins" />
        <div className="admins">
            <AdminCreator onAdminCreated={getUsers} onUserUpdated={getUsers} />
            <UserList users={users} setUsers={setUsers} onUserUpdated={getUsers} />
        </div>

        <ErrorSnackbar message={errorMessage} open={openError} setOpen={setOpenError} />
        <ConfirmationDialogRaw
          id="confirmation-dialog"
          keepMounted
          open={dialogOpen}
          onClose={handleDialogClose}
          handleconfirm={dialogOnConfirm}
        />
        </>
    );
}