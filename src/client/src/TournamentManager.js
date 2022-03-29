import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
// import { AlertContainer, alert } from "react-custom-alert";
import AppBar from "./components/appbar";
import TournamentBar from "./components/tournamentbar";
import { useParams } from "react-router-dom";
import { Button, TextField, Grid, Box, Container, Paper, Stack} from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';

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

function ManageTournament(props) {
  let [tournamentInfo, setTournamentInfo] = React.useState([]);

  React.useEffect(() => {
    fetch(
      process.env.REACT_APP_API_URL + `/tournament/${props.tournamentId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "OK") {
          showError(data.data);
        }

        setTournamentInfo(data.data);
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
          <TextField type="text" id="editDesc" label="Edit Description:" placeholder="Edit Description" InputLabelProps={{shrink: true}} />
          
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
          {/* <InputLabel htmlFor="editStartDate">Edit Start Time:</InputLabel> */}
          <TextField type="datetime-local" id="editStartDate" label="Edit Start Time" InputLabelProps={{shrink: true,}}/>
          {/* <InputLabel htmlFor="editEndDate">Edit End Time:</InputLabel> */}
          <TextField type="datetime-local" id="editEndDate" label="Edit End Time" InputLabelProps={{shrink: true}}/>
          <Button type="submit" variant="contained" onClick={submitChanges(props.tournamentId)} color="primary" >
            Save Tournament Details
          </Button>
      
      </Stack>
    </form>
    </>
  );
}

function AnnounceButton(props) {
  return (
    <Link to="/tournament/manage/announcement">
      <Button id="sendAnnon" variant="outlined" color="primary">
        Send Tournament Announcement
      </Button>
    </Link>
  );
}

function showError(error) {
  alert("Something went wrong. \n" + error);
  console.error(error);
}

function InviteButton(props) {
  function event() {
    copy();
    alertSuccess();
  }
  const copy = () => {
    navigator.clipboard.writeText("discord.gg/asura");
  };
  const alertSuccess = () =>
    alert({ message: "Copied to clipboard.", type: "success" });
  return (
    <Button
      id="createInvLink"
      onClick={event}
      variant="outlined"
      color="primary"
    >
      Copy Invite Link
    </Button>
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
      <InviteButton />
      {/* <AlertContainer floatingTime={5000} /> */}
    </Paper>
    </>
  );
}
