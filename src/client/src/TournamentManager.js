import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
// import { AlertContainer, alert } from "react-custom-alert";
import AppBar from "./components/AsuraBar";
import TournamentBar from "./components/TournamentBar";
import { useParams } from "react-router-dom";
import { Button, TextField, Grid, Box, Container, Paper, Stack } from "@mui/material";
import { Snackbar, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

let submitChanges = curryTournamentId => event => {
  event.preventDefault();
  let tournamentId = curryTournamentId;
  //TODO use refs to get values
  let tournamentName = document.getElementById("editName").value;
  let tournamentDescription = document.getElementById("editDesc").value;
  // let tournamentImageFile = document.getElementById("editImage").files[0];
  let tournamentStartDate = document.getElementById("editStartDate").value;
  let tournamentEndDate = document.getElementById("editEndDate").value;
  
  if (!tournamentName || tournamentName === "") {
    alert("Tournament name cannot be empty");
    return;
  }
  if (!tournamentDescription || tournamentDescription === "") {
    alert("Tournament description cannot be empty");
    return;
  }
  if (!tournamentStartDate || tournamentStartDate === "") {
    alert("Tournament start date cannot be empty");
    return;
  }
  if (!tournamentEndDate || tournamentEndDate === "") {
    alert("Tournament end date cannot be empty");
    return;
  }

  if (tournamentStartDate > tournamentEndDate) {
    alert("Tournament start date cannot be after end date");
    return;
  }
  let today = new Date();
  if (tournamentStartDate < today || tournamentEndDate < today) {
    alert("Tournament start and end date must be after today");
    return;
  }

  tournamentStartDate = new Date(tournamentStartDate).toUTCString();
  tournamentEndDate = new Date(tournamentEndDate).toUTCString();


  let formData = new FormData();
  formData.append("name", tournamentName);
  formData.append("description", tournamentDescription);
  // formData.append("image", tournamentImageFile);
  formData.append("startDate", tournamentStartDate);
  formData.append("endDate", tournamentEndDate);
  // formData.append("teamLimit", tournamentMaxTeams);
  let body = new URLSearchParams(formData);

  fetch(process.env.REACT_APP_API_URL + `/tournament/${tournamentId}/edit`, {
    method: "POST",
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK") {
        alert("Tournament Changed successfully");
        window.location.href = `/tournament/${tournamentId}`;
      } else {
        showError(data.data);
      }
    })
    .catch((error) => showError(error));
}
let deleteTournament = tournamentId => event => {
  event.preventDefault();
  //TODO: https://mui.com/components/dialogs/
  
  // let certain = window.confirm("Are you sure? Click OK to delete tournament");
  // if (!certain) {
  //   return;
  // }

  fetch(process.env.REACT_APP_API_URL + `/tournament/${tournamentId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK") {
        // TODO: Replace alert with Snackbar
        alert("Tournament Deleted successfully");
        window.location.href = "/";
      } else {
        showError(data.data);
      }
    })
    .catch((error) => showError(error));
}

function ManageTournament(props) {

  const [startTime, setStartTime] = React.useState([null,null]);
  const [endTime, setEndTime] = React.useState([null,null]);
  
  React.useEffect(() => {
    fetch(
      process.env.REACT_APP_API_URL + `/tournament/${props.tournamentId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "OK") {
          showError(data.data);
        }
        
        document.getElementById("editName").value = data.data.name;
        document.getElementById("editDesc").value = data.data.description;
        // setStartTime(data.data.startTime.slice(0, 16));
        // setEndTime(data.data.endTime.slice(0, 16));
      })
      .catch((err) => showError(err));
  }, [endTime, props.tournamentId, startTime]);

  return (
    <>
    <form>
    <Stack sx={{minHeight: "30vh", margin: "10px auto"}} direction="column" justifyContent="center" spacing={2} align="center">
          <TextField type="text" id="editName" label="Edit Name:" placeholder="Edit Name" InputLabelProps={{shrink: true}}/>
          <TextField type="text" multiline={true} id="editDesc" label="Edit Description:" placeholder="Edit Description" InputLabelProps={{shrink: true}} />
          <Box sx={{flexGrow: 1}}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker label={"Start Time"} inputVariant="outlined" ampm={false} mask="____-__-__ __:__" format="yyyy-MM-dd HH:mm" inputFormat="yyyy-MM-dd HH:mm" value={startTime}
                  onChange={(newValue) => {
                    setStartTime(newValue);
                    console.log(new Date(newValue).toUTCString());
                  }}
                  renderInput={(params) => <TextField id="editStartDate" {...params} />}
                />
              </LocalizationProvider>
              </Grid>
              <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker label={"End Time"} inputVariant="outlined" ampm={false} mask="____-__-__ __:__" format="yyyy-MM-dd HH:mm:" inputFormat="yyyy-MM-dd HH:mm" value={endTime}             
                  onChange={(newValue) => {
                    setEndTime(newValue);
                    console.log(new Date(newValue).toUTCString());
                  }}
                  renderInput={(params) => <TextField id="editEndDate" {...params} />}
                />
              </LocalizationProvider>
              </Grid>
            </Grid>
        </Box>
          {/* <TextField type="datetime-local" id="editStartDate" label="Edit Start Time" InputLabelProps={{shrink: true,}}/>
          <TextField type="datetime-local" id="editEndDate" label="Edit End Time" InputLabelProps={{shrink: true}}/> */}

          <Button type="submit" variant="contained" onClick={submitChanges(props.tournamentId)} color="primary" >
            Save Tournament Details
          </Button>   
      
      </Stack>
    </form>
    </>
  );
}

function showError(error) {
  alert("Something went wrong. \n" + error);
  console.error(error);
}

function ClipboardButton(props) {
  const [open, setOpen] = React.useState(false);
  function copyString() {
    navigator.clipboard.writeText(props.clipboardContent || "");
    setOpen(true);
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') { return }
    setOpen(false);
  };
  const closeAction = <>
    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  </>
    
  return (
    <>
      <Button onClick={copyString} variant="outlined" color="primary" sx={{margin: "auto 5px"}} >Copy {props.name}</Button>
      <Snackbar open={open} autoHideDuration={1500} onClose={handleClose} message={props.name + " copied to clipboard"} action={closeAction} />
    </>
  );
}

export default function TournamentManager(props) {
  const { tournamentId } = useParams();

  const [open, setOpen] = React.useState(false);
  const handleConfirm = () => {
    return true;
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    
    <>
    <AppBar pageTitle="Edit Tournament" />
    <TournamentBar pageTitle="Edit Tournament"/>
    <Paper sx={{minHeight: "30vh", width: "90vw", margin: "20px auto", padding: "20px 0"}} component={Container} direction="column" align="center">
      <ManageTournament tournamentId={tournamentId} />
      {/* <AnnounceButton /> */}
      <Box sx={{width: "100%"}}>
        <Button variant="contained" color="error" onClick={deleteTournament(tournamentId)} sx={{margin: "auto 5px"}} endIcon={<DeleteIcon />}>
          Delete Tournament
        </Button>
        <ClipboardButton clipboardContent={"https://discord.gg/asura"} name="Discord Invite Link" />
        <ClipboardButton clipboardContent={"https://asura.feal.no/tournament/" + tournamentId} name="Tournament Link" />
      </Box>
    </Paper>

    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Delete Tournament?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure? Click Confirm to delete tournament
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>

    </>
  );
}
