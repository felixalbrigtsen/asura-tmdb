import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Appbar from "./components/appbar";

import { Button, TextField, MenuItem, InputLabel, Select, Container, Slider } from '@mui/material'

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

  fetch("http://10.24.1.213:3000/api/tournament/create", {
    method: "POST",
    body: body
  })
    .then(response => response.json())
    .then(data => {
      if (data.status == "OK") {
        alert("Tournament created successfully");
        window.location.href = "/";
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
    <Container maxWidth="md">
        <InputLabel htmlFor="nameInput">Tournament Name: </InputLabel>
        <TextField type="text" id="nameInput" variant="filled" label="Tournament Name" />
        <InputLabel htmlFor="descriptionInput">Description: </InputLabel>
        <TextField type="text" id="descriptionInput" variant="filled" label="Description"/>        
        <InputLabel htmlFor="editImage">
        Tournament Image:
        <br />
          <Button variant="outlined" component="span" color="primary">
            Upload
          </Button>
       </InputLabel>
        <input
          type="file"
          id="editImage"
          accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
          style={{ display: 'none' }}
        />
        <InputLabel htmlFor="startDatePicker">Start Time:</InputLabel>
        <TextField type="datetime-local" id="startDatePicker" />
        
        <InputLabel htmlFor="endDatePicker">End Time:</InputLabel>
        <TextField type="datetime-local" id="endDatePicker" />

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
        <Slider
          aria-label="Teams"
          defaultValue={1}
          // value={value}
          // onChange={console.log(value)}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={7}
          id="max-teams-slider"
          >
        </Slider>

        {/* go brrrr */}
        <br /><br />
        
        <Button type="submit" variant="contained" onClick={submitTournament} color="primary">Create Tournament!</Button>
      </Container>
      </form>
    </>
  );
}

export default function CreateTournament(props) {
  return (
    <>
      <Appbar /> 
      <TournamentForm />
    </>
  );
}
