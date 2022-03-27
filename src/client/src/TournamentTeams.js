import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes, useParams } from "react-router-dom";
import Appbar from "./components/appbar";
import { Button, TextField, Stack, MenuItem, InputLabel, Select, Container, TableContainer, Table, TableBody, TableHead, TableCell, TableRow, Paper, Typography} from "@mui/material";

function showError(error) {
  alert("Something went wrong. \n" + error);
  console.error(error);
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
            <TableCell align="right">Team Members</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.teams.map((team) => (

            <TableRow key={team.id}>
              <TableCell component="th" scope="row"> <b>
                {team.name}
              </b></TableCell>
              <TableCell align="right">{team.members}</TableCell>
              <TableCell align="center">
                <Button variant="contained" sx={{margin: "auto 5px"}} color="primary" onClick={() => props.setselectedTeamId(team.id)}>Edit</Button>
                <Button variant="contained" sx={{margin: "auto 5px"}} color="error" onClick={() => {props.onDelete(team.id); }}>Delete</Button>
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
    fetch(process.env.REACT_APP_BACKEND_URL + `/api/team/${props.selectedTeamId}`)
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

  function postEdit() {
    let formData = new FormData();
    formData.append("name", document.getElementById("teamNameInput").value);
  }

  if (props.selectedTeamId == -1 || !team) {
    return (
      <Paper sx={{minHeight: "30vh", width: "90vw", margin: "10px auto"}} component={Stack} direction="column" justifyContent="center">
        <div align="center" >
          ... Create a new team or select one from the list above ...
        </div>
      </Paper>
    )
  }
  
  function nameInputChanged(event) {
    setTeam({...team, name: event.target.value});
  }

  return (
    <Paper sx={{minHeight: "30vh", width: "90vw", margin: "10px auto"}} component={Stack} direction="column" justifyContent="center">
    <div align="center">
      <h2><b>Edit Team:</b></h2>
      <form>
        <TextField id="teamNameInput" label="Team Name" value={team.name || ""} onChange={nameInputChanged} />
        <PlayerList players={players} setPlayers={setPlayers} />
      </form>
      </div>
    </Paper>
  )
}

export default function TournamentTeams(props) {
  const [teams, setTeams] = React.useState([]);
  const [selectedTeamId, setselectedTeamId] = React.useState(-1);
  const { tournamentId } = useParams();

  React.useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_URL + `/api/tournament/${tournamentId}/getTeams`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "OK") {
          showError(data.data);
        }
        setTeams(data.data);
        //setselectedTeamId(teams[0].id);
      })
      .catch((err) => showError(err));
  }, []);
  
  return (
    <>
    <Appbar />
    <div className="tournamentTeams">
      <TeamList teams={teams} selectedTeamId={selectedTeamId} setselectedTeamId={setselectedTeamId} />
      <TeamEditor teams={teams} selectedTeamId={selectedTeamId} />
    </div>
    </>
  );
}