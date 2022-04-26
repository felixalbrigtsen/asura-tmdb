import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
// import { AlertContainer, alert } from "react-custom-alert";
import Appbar from "./components/AsuraBar";
import TournamentBar from "./components/TournamentBar";
import LoginPage from "./LoginPage";
import { useParams } from "react-router-dom";
import { Button, TextField, Grid, Box, Container, Paper, Stack } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import PropTypes from 'prop-types'

let submitChanges = curryTournamentId => event => {
  event.preventDefault();
  let tournamentId = curryTournamentId;
  //TODO: use refs to get values
  let tournamentName = document.getElementById("editName").value;
  let tournamentDescription = document.getElementById("editDesc").value;
  // let tournamentImageFile = document.getElementById("editImage").files[0];
  let tournamentStartDate = document.getElementById("editStartDate").value;
  let tournamentEndDate = document.getElementById("editEndDate").value;
  let tournamentPrize = document.getElementById("editPrize").value

  if (!tournamentName || tournamentName === "") {
    showError("Tournament name cannot be empty");
    return;
  }
  if (!tournamentDescription || tournamentDescription === "") {
    showError("Tournament description cannot be empty");
    return;
  }
  if (!tournamentStartDate || tournamentStartDate === "") {
    showError("Tournament start date cannot be empty");
    return;
  }
  if (!tournamentEndDate || tournamentEndDate === "") {
    showError("Tournament end date cannot be empty");
    return;
  }

  if (tournamentStartDate > tournamentEndDate) {
    showError("Tournament start date cannot be after end date");
    return;
  }
  let today = new Date();
  if (tournamentStartDate < today || tournamentEndDate < today) {
    showError("Tournament start and end date must be after today");
    return;
  }

  tournamentStartDate = new Date(tournamentStartDate).valueOf() - new Date().getTimezoneOffset() * 60 * 1000;
  tournamentEndDate = new Date(tournamentEndDate).valueOf() - new Date().getTimezoneOffset() * 60 * 1000;


  let formData = new FormData();
  formData.append("name", tournamentName);
  formData.append("description", tournamentDescription);
  formData.append("startDate", tournamentStartDate);
  formData.append("endDate", tournamentEndDate);
  // formData.append("teamLimit", tournamentMaxTeams);
  formData.append("prize", tournamentPrize)
  let body = new URLSearchParams(formData);

  fetch(process.env.REACT_APP_API_URL + `/tournament/${tournamentId}/edit`, {
    method: "POST",
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK") {
        showSuccess("Tournament Changed successfully");
        window.location.href = `/tournament/${tournamentId}`;
      } else {
        showError(data.data);
      }
    })
    .catch((error) => showError(error));
}

let deleteTournament = tournamentId => event => {
  console.log(tournamentId);
  event.preventDefault();

  fetch(process.env.REACT_APP_API_URL + `/tournament/${tournamentId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK") {
        showSuccess("Tournament Deleted successfully");
        window.location.href = "/";
      } else {
        showError(data.data);
      }
    })
    .catch((error) => showError(error));
}

function ManageTournament(props) {

  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());
  
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
        document.getElementById("editPrize").value = data.data.prize
        // Get the time from the server, add the local timezone offset and set the input fields
        let startDate = new Date(data.data.startTime.slice(0, 16));
        let endDate = new Date(data.data.endTime.slice(0, 16));
        let localTimeOffset = new Date().getTimezoneOffset() * 60*1000; // Minutes -> Milliseconds
        startDate = new Date(startDate.getTime() - localTimeOffset);
        endDate = new Date(endDate.getTime() - localTimeOffset);

        setStartTime(startDate);
        setEndTime(endDate);
      })
      .catch((err) => showError(err));
  }, [props.tournamentId]);

  return (
    <>
    <form>
    <Stack sx={{minHeight: "30vh", margin: "1.5%"}} direction="column" justifyContent="center" spacing={2} align="center">
          <TextField type="text" id="editName" label="Edit Name:" placeholder="Edit Name" InputLabelProps={{shrink: true}}/>
          <TextField type="text" multiline={true} id="editDesc" label="Edit Description:" placeholder="Edit Description" InputLabelProps={{shrink: true}} />
          <TextField type="text" id="editPrize" label="Edit Prize:" placeholder="Edit Prize" InputLabelProps={{shrink: true}}/>
          <Box sx={{flexGrow: 1}}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker label={"Start Time"} inputVariant="outlined" ampm={false} mask="____-__-__ __:__" format="yyyy-MM-dd HH:mm" inputFormat="yyyy-MM-dd HH:mm" value={startTime}
                  onChange={setStartTime}
                  renderInput={(params) => <TextField id="editStartDate" {...params} />}
                />
              </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker label={"End Time"} inputVariant="outlined" ampm={false} mask="____-__-__ __:__" format="yyyy-MM-dd HH:mm:" inputFormat="yyyy-MM-dd HH:mm" value={endTime}             
                  onChange={setEndTime}
                  renderInput={(params) => <TextField id="editEndDate" {...params} />}
                />
              </LocalizationProvider>
              </Grid>
            </Grid>
        </Box>
          <Button type="submit" variant="contained" onClick={submitChanges(props.tournamentId)} color="primary" >
            Save Tournament Details
          </Button>   
      
      </Stack>
    </form>
    </>
  );
}

function ConfirmationDialogRaw(props) {
  const { tournamentId } = useParams();
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

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>Delete tournament?</DialogTitle>
      <DialogContent>
        Are you sure you want to delete the tournament? This action is not reversible!
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={deleteTournament(tournamentId)}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

let showError = (message) => {};
let showSuccess = (message) => {};

export default function TournamentManager(props) {
  const { tournamentId } = useParams();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const handleDialogClickListItem = () => { setDialogOpen(true); };
  const handleDialogClose = () => { setDialogOpen(false); };

  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  showError = (message) => {
    setOpenError(false);
    setErrorMessage(message);
    setOpenError(true);
  }

  if (!props.user.isLoggedIn) { return <LoginPage user={props.user} />; }

  return (
    <>
    <Appbar user={props.user} pageTitle="Edit Tournament" />
    <TournamentBar pageTitle="Edit Tournament"/>
    <Paper sx={{minHeight: "30vh", width: "90vw", margin: "20px auto", padding: "20px 0"}} component={Container} direction="column" align="center">
      <ManageTournament tournamentId={tournamentId} />
      {/* <AnnounceButton /> */}
      <Box sx={{width: "100%"}}>
        <Button variant="contained" color="error" onClick={handleDialogClickListItem} sx={{margin: "auto 5px"}} endIcon={<DeleteIcon />}>
          Delete Tournament
        </Button>
        <ConfirmationDialogRaw
          id="confirmation-dialog"
          keepMounted
          open={dialogOpen}
          onClose={handleDialogClose}
        />
      </Box>
    </Paper>
    </>
  );
}
