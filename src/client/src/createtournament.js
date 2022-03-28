import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Appbar from "./components/appbar";

import { Button, TextField, Stack, InputLabel, Select, Container, Slider, Paper, Box, Grid } from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';

function submitTournament(event) {
  event.preventDefault();
  //TODO use refs to get values
  let tournamentName = document.getElementById("nameInput").value;
  let tournamentDescription = document.getElementById("descriptionInput").value;
  let tournamentImageFile = document.getElementById("editImage").files[0];
  let tournamentStartDate = document.getElementById("startDatePicker").value;
  let tournamentEndDate = document.getElementById("endDatePicker").value;
  let tournamentMaxTeams = document.getElementById("max-teams-select").value;
  
  if (!tournamentName || tournamentName == "") {
    alert("Tournament name cannot be empty");
    return;
  }
  if (!tournamentDescription || tournamentDescription == "") {
    alert("Tournament description cannot be empty");
    return;
  }
  if (!tournamentStartDate || tournamentStartDate == "") {
    alert("Tournament start date cannot be empty");
    return;
  }
  if (!tournamentEndDate || tournamentEndDate == "") {
    alert("Tournament end date cannot be empty");
    return;
  }
  if (!tournamentMaxTeams || isNaN(tournamentMaxTeams) || tournamentMaxTeams < 2) {
    alert("Tournament max teams cannot be empty");
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
  formData.append("teamLimit", tournamentMaxTeams);
  let body = new URLSearchParams(formData);

  fetch(process.env.REACT_APP_BACKEND_URL + "/api/tournament/create", {
    method: "POST",
    body: body
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "OK") {
        alert("Tournament created successfully");
        let tournamentId = data.data.tournamentId;
        if (tournamentId) {
          window.location.href = "/tournament/" + tournamentId;
        }
      } else {
        showError(data.data)
      }
    })
    .catch(error => showError(error));

}
function showError(error) {
  alert("Something went wrong. \n" + error);
  console.error(error);
}

function TournamentForm(props) {
  return (
    <>
    <form>
    <Stack sx={{minHeight: "30vh", margin: "10px auto"}} direction="column" justifyContent="center" spacing={3} align="center">
        {/* <InputLabel htmlFor="nameInput">Tournament Name: </InputLabel> */}
        <TextField type="text" id="nameInput" label="Tournament Name" placeholder="Tournament Name" InputLabelProps={{shrink: true}}/>
        {/* <InputLabel htmlFor="descriptionInput">Description: </InputLabel */}
        <TextField type="text" id="descriptionInput" label="Description" placeholder="Descrption" InputLabelProps={{shrink: true}}/>        
        <Box sx={{ flexGrow: 1 }}>
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
        </Box>
        {/* <InputLabel htmlFor="startDatePicker">Start Time:</InputLabel> */}
        <TextField type="datetime-local" id="startDatePicker" label="Start Time" InputLabelProps={{shrink: true}}/>
        
        {/* <InputLabel htmlFor="endDatePicker">End Time:</InputLabel> */}
        <TextField type="datetime-local" id="endDatePicker" label="End Time" InputLabelProps={{shrink: true}}/>

        <InputLabel id="max-teams-label">Maximum number of teams</InputLabel>
        {/* <Select
          labelId="max-teams-label"
          id="max-teams-select"
          onChange={(event) => {
            console.log(event.target.value);
          } }
          value={8}
          label="Max Teams"
        >
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={16}>16</MenuItem>
          <MenuItem value={32}>32</MenuItem>
          <MenuItem value={64}>64</MenuItem>
          <MenuItem value={128}>128</MenuItem>
        </Select> */}
        <select id="max-teams-select">
          <option value={2}>2</option>
          <option value={4}>4</option>
          <option value={8}>8</option>
          <option value={16}>16</option>
          <option value={32}>32</option>
          <option value={64}>64</option>
          <option value={128}>128</option>
        </select>
        <Slider aria-label="Teams" defaultValue={1} valueLabelDisplay="auto" step={1} marks min={1} max={7} id="max-teams-slider" name="max-teams-slider" >
        </Slider>

        {/* go brrrr */}
        <br /><br />
        
        <Button type="submit" variant="contained" onClick={submitTournament} color="primary">Create Tournament!</Button>
      </Stack>
      </form>
    </>
  );
}

export default function CreateTournament(props) {
  return (
    <>
      <Appbar pageTitle="New tournament" /> 
      <Paper sx={{minHeight: "30vh", width: "90vw", margin: "20px auto", padding: "20px 0"}} component={Container} direction="column" align="center">
      <TournamentForm />
      </Paper>
    </>
  );
}
