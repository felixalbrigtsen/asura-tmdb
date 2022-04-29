import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes, useParams } from "react-router-dom";
import Appbar from "./components/AsuraBar";
import TournamentBar from "./components/TournamentBar";
import ErrorSnackbar from "./components/ErrorSnackbar";
import LoginPage from "./LoginPage";
import { Button, TextField, Stack, Box, Table, TableBody, TableHead, TableCell, TableRow, Paper} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function TeamCreator(props) {
  function postCreate() { // Posts new team to api when the form is submitted
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
    <Paper sx={{width: "90vw", margin: "10px auto", padding: "15px", align:'center', justifyContent:'center', flexGrow:1}} component={Stack} direction={['column']} spacing={2}>
      <div align="center">
        <form>
        <TextField id="teamNameInput" sx={{width:['auto','50%','60%','70%'], margin:'1% 0'}} label="Team Name" variant="outlined" />
        <Button type="submit" variant="contained" color="success" onClick={postCreate} sx={{ margin:'1% 1%',width:['fit-content','40%','30%','20%']}}>
          <Box sx={{padding: "10px"}}>
            Create Team
          </Box>
          <AddCircleIcon />
        </Button>
        </form>
      </div>
      
    </Paper>
  )
}

function TeamList(props) {
  const deleteTeam = teamId => {
    fetch(process.env.REACT_APP_API_URL + `/team/${teamId}`, {method: "DELETE"})
      .then(res => res.json())
      .then(data => {
        if (data.status !== "OK") {
          showError(data.data);
          return;
        }
        props.setTeams(props.teams.filter(team => team.id !== teamId));
      })
      .catch(error => showError(error));
  }

  function search() { 
    // Update search criteria and re-render the list
    let searchBase = [];
    let searchResult = [];
    let originalList = props.originalList; // Stores the original list of teams before searching
    originalList.map((tournament) => searchBase.push(tournament.name));
    let input = document.getElementById("searchInput");
    let inputUpperCase = input.value.toUpperCase();
    for (let i = 0; i < searchBase.length; i++) { // Matches search input with any part of the team names
      let tournamentName = searchBase[i].toUpperCase();
      if(tournamentName.indexOf(inputUpperCase) >= 0) {
        searchResult.push(tournamentName);
      }
    }

    let searchedList = [];
    for (let i = 0; i < originalList.length; i++) {
      let name = originalList[i].name;
      for (let j = 0; j < searchResult.length; j++) {
        if (name.toUpperCase() === searchResult[j]) {
          searchedList.push(originalList[i]);
        }
      }
    }

    if (input.value === "") {
      props.setTeams(originalList);
    } else {
      props.setTeams(searchedList);
    }
  }

  return (
  <Paper sx={{minHeight: "30vh", width: "90vw", margin: "10px auto"}} component={Stack} direction="column" justifyContent="center">
  <div align="center" >
    <TextField sx={{margin:'2.5% 0 0 0', width: '50%'}} type="text" id="searchInput" label="Search" placeholder="Team Name" InputLabelProps={{shrink: true}} onChange={search}/>   
 
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><h2>Team Name</h2></TableCell>
            <TableCell align="center"><h2>Actions</h2></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.teams.map((team) => (

            <TableRow key={team.id}>
              <TableCell component="th" scope="row"> <b>
                {team.name}
              </b></TableCell>
              <TableCell align="center">
                <Button variant="contained" sx={{margin: "auto 5px"}} color="primary" onClick={() => {props.setSelectedTeamId(team.id); window.scrollTo(0, document.body.scrollHeight)}} endIcon={<EditIcon />}>Edit</Button>
                <Button variant="contained" sx={{margin: "auto 5px"}} color="error" onClick={() => {deleteTeam(team.id)}} endIcon={<DeleteIcon />}>Delete</Button>
              </TableCell>
            </TableRow>

          ))}
        </TableBody>
      </Table>
  </div>
  </Paper>
  );
}

function TeamEditor(props) {
  // Component that returns a team name editor if a team is selected in the list.
  const [team, setTeam] = React.useState({});
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

  if (props.selectedTeamId === -1 || !team) { //returns if no team is selected for editing
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

  function handleFocus(event) {
    event.currentTarget.select()
  }

  function saveTeam() { //pushes new team name to api
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
      props.setTeams(props.teams.map(origTeam => origTeam.id === team.id ? team : origTeam));
      props.setSelectedTeamId(-1);
    }
    );
  }

  return ( 
    <Paper sx={{minHeight: "30vh", width: "90vw", margin: "10px auto"}} component={Stack} direction="column" justifyContent="center">
    <div align="center">
      <h2><b>Edit Team:</b></h2>
      <form>
        <TextField id="newTeamNameInput" label="Team Name" value={team.name || ""} onChange={nameInputChanged} onFocus={handleFocus} sx={{width: "80%"}} />
        <Button type="submit" variant="contained" sx={{margin: "auto 5px"}} color="primary" onClick={saveTeam}>Save</Button>
      </form>
      </div>
    </Paper>
  )
}

let showError = (message) => {};

export default function TournamentTeams(props) {
  const [teams, setTeams] = React.useState([]);
  const [selectedTeamId, setSelectedTeamId] = React.useState(-1);
  const [originalList, setOriginalList] = React.useState([])
  const { tournamentId } = useParams();

  function getTeams() {
    fetch(process.env.REACT_APP_API_URL + `/tournament/${tournamentId}/getTeams`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "OK") {
          showError(data.data);
        }
        setTeams(data.data);
        setOriginalList(data.data)
      })
      .catch((err) => showError(err));
  }
  React.useEffect(() => {
    getTeams()
  }, []);

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
    <Appbar user={props.user} pageTitle="Edit teams" />
    <TournamentBar pageTitle="Manage Teams" />
    <div className="tournamentTeams">
      <TeamCreator tournamentId={tournamentId} teams={teams} onTeamCreated={getTeams} />
      <TeamList teams={teams} setTeams={setTeams} selectedTeamId={selectedTeamId} setSelectedTeamId={setSelectedTeamId} originalList={originalList} setOriginalList={setOriginalList} />
      <TeamEditor teams={teams} setTeams={setTeams} selectedTeamId={selectedTeamId} setSelectedTeamId={setSelectedTeamId} />
    </div>
    <ErrorSnackbar message={errorMessage} open={openError} setOpen={setOpenError} />
    </>
  );
}