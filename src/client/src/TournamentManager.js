import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
// import { AlertContainer, alert } from "react-custom-alert";
import AppBar from "./components/Appbar";
import TournamentBar from "./components/TournamentBar";
import { useParams } from "react-router-dom";
import { Button, TextField, Grid, Box, Container, Paper, Stack} from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';

//Dependency for snackbar/popup
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

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
  let certain = window.confirm("Are you sure? Click OK to delete tournament");
  if (!certain) {
    return;
  }

  fetch(process.env.REACT_APP_API_URL + `/tournament/${tournamentId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK") {
        alert("Tournament Deleted successfully");
        window.location.href = "/";
      } else {
        showError(data.data);
      }
    })
    .catch((error) => showError(error));
}
function ManageTournament(props) {
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
        document.getElementById("editStartDate").value = data.data.startTime.slice(0, 16);
        document.getElementById("editEndDate").value = data.data.endTime.slice(0, 16);
      })
      .catch((err) => showError(err));
  }, []);

  return (
    <>
    <form>
    <Stack sx={{minHeight: "30vh", margin: "10px auto"}} direction="column" justifyContent="center" spacing={2} align="center">
          {/* <InputLabel htmlFor="editName">Edit name: </InputLabel> */}
          <TextField type="text" id="editName" label="Edit Name:" placeholder="Edit Name" InputLabelProps={{shrink: true}}/>
          {/* <InputLabel htmlFor="editDesc">Edit description: </InputLabel> */}
          <TextField type="text" multiline={true} id="editDesc" label="Edit Description:" placeholder="Edit Description" InputLabelProps={{shrink: true}} />
          
              {/* <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={-20} justifyContent="center">
                  <Grid item xs={2}>
                    <Container>Edit Image:</Container>
                  </Grid>
                  <Grid item xs={2}>
                    <Container>
                    <label htmlFor="editImage">
                      <Button variant="contained" component="span" endIcon={<FileUploadIcon />}>
                        Upload 
                      </Button>
                      <input accept="image/*" id="editImage" multiple type="file" style={{ display: 'none' }} />
                      </label>
                    </Container>
                  </Grid>
                </Grid>
              </Box> */}
          <TextField type="datetime-local" id="editStartDate" label="Edit Start Time" InputLabelProps={{shrink: true,}}/>
          <TextField type="datetime-local" id="editEndDate" label="Edit End Time" InputLabelProps={{shrink: true}}/>

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
  return (
    <>
    <AppBar pageTitle="Edit Tournament" />
    <TournamentBar pageTitle="Edit Tournament"/>
    <Paper sx={{minHeight: "30vh", width: "90vw", margin: "20px auto", padding: "20px 0"}} component={Container} direction="column" align="center">
      <ManageTournament tournamentId={tournamentId} />
      {/* <AnnounceButton /> */}
      <Box sx={{width: "100%"}}>
        <Button variant="contained" color="error" onClick={deleteTournament(tournamentId)} sx={{margin: "auto 5px"}}>
          Delete Tournament
        </Button>
        <ClipboardButton clipboardContent={"https://discord.gg/asura"} name="Discord Invite Link" />
        <ClipboardButton clipboardContent={"https://asura.feal.no/tournament/" + tournamentId} name="Tournament Link" />
      </Box>
      
    </Paper>
    </>
  );
}
