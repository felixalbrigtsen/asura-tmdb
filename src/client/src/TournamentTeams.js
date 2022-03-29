import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes, useParams } from "react-router-dom";
import Appbar from "./components/appbar";
import TournamentBar from "./components/tournamentbar";
import { Button, TextField, Stack, MenuItem, Box, InputLabel, Select, Container, TableContainer, Table, TableBody, TableHead, TableCell, TableRow, Paper, Typography} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function showError(error) {
  alert("Something went wrong. \n" + error);
  console.error(error);
}

function ReturnButton() {
  const { tournamentId } = useParams();
  return(
  <Link to={`/tournament/${tournamentId}`}>
    <Button type="button" variant="contained" color="primary" >
      <Box>
        Return to Tournament
      </Box>
    </Button>
  </Link>
  )
}

function TeamCreator(props) {
  function postCreate() {
    let teamName = document.getElementById("teamNameInput").value;
    if (!teamName) {
      showError("Team name is required");
      return;
    }

    let formData = new FormData();
    formData.append("name", teamName);
    let body = new URLSearchParams(formData)

    fetch(process.env.REACT_APP_API_URL + `/tournament/${props.tournamentId}/createTeam`, {
      method: "POST",
      body: body
    })
    .then(res => res.json())
    .then(data => {
      if (data.status !== "OK") {
        showError(data.data);
        return;
      }
      document.getElementById("teamNameInput").value = "";
      props.onTeamCreated();
    }
    )
  }

  return (
    <Paper sx={{width: "90vw", margin: "10px auto", padding: "15px"}} component={Stack} direction="column">
      <div align="center">
        <TextField id="teamNameInput" sx={{ width: "70%" }} label="Team Name" variant="outlined" />
        {/* <Button variant="contained" color="primary" onClick={postCreate}>Create Team</Button> */}
        <Button variant="contained" color="success" onClick={postCreate} sx={{width: "20%", marginLeft: "5px"}}>
          <Box sx={{padding: "10px"}}>
            Create Team
          </Box>
          <AddCircleIcon />
        </Button>
      </div>
    </Paper>
  )
}

function TeamList(props) {
  return (
  <Paper sx={{minHeight: "30vh", width: "90vw", margin: "10px auto"}} component={Stack} direction="column" justifyContent="center">
  <div align="center" >
  <h2><b>Teams:</b></h2>
  {/* TODO: scroll denne menyen, eventuelt søkefelt */}
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Team Name</TableCell>
            {/* <TableCell align="right">Team Members</TableCell> */}
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.teams.map((team) => (

            <TableRow key={team.id}>
              <TableCell component="th" scope="row"> <b>
                {team.name}
              </b></TableCell>
              {/* <TableCell align="right">{team.members}</TableCell> */}
              <TableCell align="center">
                <Button variant="contained" sx={{margin: "auto 5px"}} color="primary" onClick={() => props.setSelectedTeamId(team.id)} endIcon={<EditIcon />}>Edit</Button>
                <Button variant="contained" sx={{margin: "auto 5px"}} color="error" onClick={() => {props.onDelete(team.id); }} endIcon={<DeleteIcon />}>Delete</Button>
              </TableCell>
            </TableRow>

          ))}
        </TableBody>
      </Table>
  </div>
  </Paper>
  );
}

function PlayerList(props) {
  // Something like https://react-list-editable.netlify.app/
  return <h1>PlayerList coming...</h1>
}

function TeamEditor(props) {
  const [team, setTeam] = React.useState({});
  const [players, setPlayers] = React.useState([]);
  React.useEffect(() => {
    if (props.selectedTeamId === -1) {
      setTeam({});
      return;
    }
    fetch(process.env.REACT_APP_API_URL + `/team/${props.selectedTeamId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status !== "OK") {
          showError(data);
          return;
        }
        setTeam(data.data);
      })
      .catch(error => showError(error));
  }, [props.selectedTeamId]);

  if (props.selectedTeamId === -1 || !team) {
    return (
      <Paper sx={{minHeight: "30vh", width: "90vw", margin: "10px auto"}} component={Stack} direction="column" justifyContent="center">
        <div align="center" >
          ... Create a new team or select one from the list above ...
        </div>
      </Paper>
    )
  }
  
  function nameInputChanged(event) {
    let newTeam = {...team};
    newTeam.name = event.target.value;
    setTeam(newTeam);
  }

  function saveTeam() {
    let formData = new FormData();
    formData.append("name", team.name);
    let body = new URLSearchParams(formData)
    fetch(process.env.REACT_APP_API_URL + `/team/${team.id}/edit`, {
      method: "POST",
      body: body
    })
    .then(res => res.json())
    .then(data => {
      if (data.status !== "OK") {
        showError(data.data);
        return;
      }
      setTeam(data.data);
      props.setTeams(props.teams.map(listTeam => listTeam.id === team.id ? team : listTeam));
      props.setSelectedTeamId(-1);
    }
    );
  }

  return (
    <Paper sx={{minHeight: "30vh", width: "90vw", margin: "10px auto"}} component={Stack} direction="column" justifyContent="center">
    <div align="center">
      <h2><b>Edit Team:</b></h2>
      <form>
        <TextField id="teamNameInput" label="Team Name" value={team.name || ""} onChange={nameInputChanged} sx={{width: "80%"}} />
        {/* <PlayerList players={players} setPlayers={setPlayers} /> */}
        <Button variant="contained" sx={{margin: "auto 5px"}} color="primary" onClick={saveTeam}>Save</Button>
      </form>
      </div>
    </Paper>
  )
}

export default function TournamentTeams(props) {
  const [teams, setTeams] = React.useState([]);
  const [selectedTeamId, setSelectedTeamId] = React.useState(-1);
  const { tournamentId } = useParams();

  function getTeams() {
    fetch(process.env.REACT_APP_API_URL + `/tournament/${tournamentId}/getTeams`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "OK") {
          showError(data.data);
        }
        setTeams(data.data);
        //setselectedTeamId(teams[0].id);
      })
      .catch((err) => showError(err));
  }
  React.useEffect(() => {
    getTeams()
  }, []);
  
  return (
    <>
    <Appbar pageTitle="Edit teams" />
    <TournamentBar pageTitle="Edit Teams" />
    <ReturnButton />
    <div className="tournamentTeams">
      <TeamCreator tournamentId={tournamentId} teams={teams} onTeamCreated={getTeams} />
      <TeamList teams={teams} selectedTeamId={selectedTeamId} setSelectedTeamId={setSelectedTeamId} />
      <TeamEditor teams={teams} setTeams={setTeams} selectedTeamId={selectedTeamId} setSelectedTeamId={setSelectedTeamId} />
    </div>
    </>
  );
}