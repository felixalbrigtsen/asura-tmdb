import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Appbar from "./components/AsuraBar";
import ErrorSnackbar from "./components/ErrorSnackbar";
import LoginPage from "./LoginPage";
import { Button, TextField, Stack, InputLabel, Select, Container, Slider, Paper, Box, Grid, Typography } from '@mui/material';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { setDate } from "date-fns";

function postTournament(tournamentName, tournamentDescription, tournamentStartDate, tournamentEndDate, tournamentMaxTeams, tournamentPrize) {
  if (!tournamentName || tournamentName === "") {
    showError("Tournament name cannot be empty");
    return;
  }
  if (!tournamentDescription || tournamentDescription === "") {
    showError("Tournament description cannot be empty");
    return;
  }
  if (!tournamentStartDate || tournamentStartDate === "" || tournamentStartDate === 0) {
    showError("Tournament start date cannot be empty");
    return;
  }
  if (!tournamentEndDate || tournamentEndDate === "" || tournamentEndDate === 0) {
    showError("Tournament end date cannot be empty");
    return;
  }
  if (!tournamentMaxTeams || isNaN(tournamentMaxTeams) || tournamentMaxTeams < 4) {
    showError("Tournament max teams cannot be empty");
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

  let formData = new FormData();
  formData.append("name", tournamentName);
  formData.append("description", tournamentDescription);
  formData.append("startDate", tournamentStartDate);
  formData.append("endDate", tournamentEndDate);
  formData.append("teamLimit", tournamentMaxTeams);
  formData.append("prize", tournamentPrize)
  let body = new URLSearchParams(formData);

  fetch(process.env.REACT_APP_API_URL + `/tournament/create`, {
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

function TournamentForm(props) {
  const [maxTeamsExponent, setMaxTeamsExponent] = React.useState(2);
  function sliderUpdate(event) {
    setMaxTeamsExponent(event.target.value);
  }

  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());

  function submitTournament(event) {
    event.preventDefault();
    let maxTeams = Math.pow(2, maxTeamsExponent);
    let tournamentStart = new Date(startTime.setSeconds(0, 0, 0)).valueOf() - new Date().getTimezoneOffset() * 60*1000;
    let tournamentEnd = new Date(endTime.setSeconds(0, 0, 0)).valueOf() - new Date().getTimezoneOffset() * 60*1000;
    postTournament(
      document.getElementById("nameInput").value,
      document.getElementById("descriptionInput").value,
      tournamentStart,
      tournamentEnd,
      maxTeams,
      document.getElementById("prizeInput").value
    );
  }

  const marks = [
    {  value: 2,  label: "4",},
    {  value: 3,  label: "8",},
    {  value: 4,  label: "16",},
    {  value: 5,  label: "32",},
    {  value: 6,  label: "64",}
  ];

  return (
    <>
    <form>
    <Stack sx={{minHeight: "30vh", margin: "10px auto"}} direction="column" justifyContent="center" spacing={3} align="center">
        {/* <InputLabel htmlFor="nameInput">Tournament Name: </InputLabel> */}
        <TextField type="text" id="nameInput" label="Tournament Name" placeholder="Tournament Name" InputLabelProps={{shrink: true}}/>
        {/* <InputLabel htmlFor="descriptionInput">Description: </InputLabel */}
        <TextField type="text" multiline={true} id="descriptionInput" label="Description" placeholder="Description" InputLabelProps={{shrink: true}}/>        
        <TextField type="text" id="prizeInput" label="Prize" placeholder="Prize" InputLabelProps={{shrink: true}}/>     
        <Box flexGrow={1}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker label={"Start Time"} inputVariant="outlined" ampm={false} mask="____-__-__ __:__" format="yyyy-MM-dd HH:mm" inputFormat="yyyy-MM-dd HH:mm" value={startTime}
              onChange={setStartTime}
              renderInput={(params) => <TextField id="startDatePicker" {...params} sx={{margin: "0 2.5%"}} />}
            />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4}>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker label={"End Time"} inputVariant="outlined" ampm={false} mask="____-__-__ __:__" format="yyyy-MM-dd HH:mm" inputFormat="yyyy-MM-dd HH:mm" value={endTime}
              onChange={setEndTime}
              renderInput={(params) => <TextField id="endDatePicker" {...params} sx={{margin: "0 2.5%"}} />}
            />
          </LocalizationProvider>
          </Grid>
          {/* <TextField type="datetime-local" id="startDatePicker" label="Start Time" InputLabelProps={{shrink: true}} sx={{width: "48%", marginRight: "2%"}} />
          <TextField type="datetime-local" id="endDatePicker" label="End Time" InputLabelProps={{shrink: true}} sx={{width: "48%", marginLeft: "2%"}} /> */}
        </Grid>
        </Box>
        <InputLabel id="max-teams-label">Maximum number of teams</InputLabel>
        
        <Box sx={{flexGrow: 1}}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={8}>
              <Container>
                <Slider aria-label="Teams" valueLabelDisplay="off" step={1} marks={marks} min={2} max={6} onChange={sliderUpdate} id="max-teams-slider" name="max-teams-slider" >
                </Slider>
              </Container>
            </Grid>
          </Grid>
        </Box>

        {/* go brrrr */}
        <br /><br />
        
        <Button type="submit" variant="contained" onClick={submitTournament} color="primary">Create Tournament!</Button>
      </Stack>
      </form>
    </>
  );
}

let showError = (message) => {};

export default function TournamentCreator(props) {
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
      <Appbar user={props.user} pageTitle="New tournament" /> 
      <Paper sx={{minHeight: "30vh", width: "90vw", margin: "20px auto", padding: "20px 20px"}} component={Container} direction="column" align="center">
      <TournamentForm />
      </Paper>
      
      <ErrorSnackbar message={errorMessage} open={openError} setOpen={setOpenError} />
    </>
  );
}
