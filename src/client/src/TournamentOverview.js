import * as React from "react";
import { Link } from "react-router-dom";
import Appbar from './components/AsuraBar';
import TournamentBar from "./components/TournamentBar";
import ErrorSnackbar from "./components/ErrorSnackbar";
import { useParams } from 'react-router-dom'
import { Button, IconButton, Paper, Stack, CircularProgress, Box, Grid, Typography, Container } from "@mui/material";
import "./components/tournamentBracket.css";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import BackspaceIcon from '@mui/icons-material/Backspace';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function TournamentTier(props){
  let roundTypes = ["winner","finals", "semifinals", "quarterfinals", "eighthfinals", "sixteenthfinals", "thirtysecondfinals"];
    let matches = [];
    for (let i = 0; i < props.matches.length; i++) {
      matches.push(<Match tournament={props.tournament} user={props.user} teams={props.teams} match={props.matches[i]} key={i} />);
    }
    return(
      <ul className={`round ${roundTypes[props.tier]}`}>
        <li className="spacer">&nbsp;</li>
        {matches}
      </ul>
    )
}

function Match(props){
  let team1Name = "TBA";
  let team2Name = "TBA";
  if(props.match.team1Id !== null) {
    team1Name = props.teams.find(team => team.id === props.match.team1Id).name;
  }
  if(props.match.team2Id !== null) {
    team2Name = props.teams.find(team => team.id === props.match.team2Id).name;
  }

  let setWinner = curryTeamId => event => {
    let teamId = curryTeamId;
    // console.log(teamId)
    if (!teamId || teamId == null) {
      showError("No team selected");
      return;
    }
    let formData = new FormData();
    formData.append("winnerId",teamId);
    let body = new URLSearchParams(formData);
    fetch(process.env.REACT_APP_API_URL + `/match/${props.match.id}/setWinner`, {
      method: "POST",
      body: body
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "OK") {
          //Refresh when winner is set successfully
          window.location.reload();
        } else {
          showError(data.data)
        }
      })
      .catch(error => showError(error));
  };

  let curryUnsetContestant = teamId => (e) => {
    console.log("wack")
    let formData = new FormData();
    formData.append("teamId", teamId);
    let body = new URLSearchParams(formData);
    console.log(props.match)
    fetch(process.env.REACT_APP_API_URL + `/match/${props.match.id}/unsetContestant`, {
      method: "POST", 
      body: body
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "OK") {
          console.log("wacky smacky");
          window.location.reload();
        }
      })
      .catch(error => showError(error));
  }

  return (
    <>
        {/* Team 1 (Winner-status?) (Team name) */}
        <li className={`game game-top ${props.match.winnerId !== null ? (props.match.team1Id === props.match.winnerId) ? "winner"  : "loser" : ""}`}>
          <Stack direction={"row"}>
              <Typography className={`teamName`} align={'center'} sx={{fontSize:'1.5rem', maxWidth:'15vw', overflow:'hidden', wordWrap:'none'}}>
                {team1Name}
              </Typography>
              { props.match.winnerId && (props.match.team1Id === props.match.winnerId) &&
              <EmojiEventsIcon alt="A trohpy" color="gold" />
              }
              { props.match.team1Id !== null && !props.tournament.hasEnded && props.match.tier !== Math.log2(props.tournament.teamLimit) - 1 && props.match.winnerId === null && props.user.isLoggedIn &&
              <IconButton color="error" aria-label="remmove winner" component="span" onClick={curryUnsetContestant(props.match.team1Id)}><BackspaceIcon /></IconButton>
              }
              { props.match.team1Id !== null && props.match.winnerId === null && !props.tournament.hasEnded && props.user.isLoggedIn &&
              <IconButton onClick={setWinner(props.match.team1Id)} color="success" aria-label="select winner" component="span"><AddCircleIcon /></IconButton>
              }
          </Stack>
        </li>
        <li className="game game-spacer">&nbsp;</li>
        {/* Team 2 (Winner-status?) (Team name) */}
        <li className={`game game-bottom ${props.match.winnerId !== null ? (props.match.team1Id === props.match.winnerId) ? "winner"  : "loser" : ""}`}>
        <Stack direction={"row"} sx={{alignItems:'center'}}>
              <Typography className={`teamName`} sx={{fontSize:'1.5rem', maxWidth:'15vw', overflow:'hidden', wordWrap:'none'}}>
                {team2Name}
              </Typography>
              { props.match.winnerId && (props.match.team2Id === props.match.winnerId) &&
              <EmojiEventsIcon alt="A trohpy" color="gold" />
              }
              { props.match.team2Id !== null && !props.tournament.hasEnded && props.match.tier !== Math.log2(props.tournament.teamLimit) - 1 && props.match.winnerId === null && props.user.isLoggedIn &&
              <IconButton color="error" aria-label="remmove winner" component="span" onClick={curryUnsetContestant(props.match.team2Id)}><BackspaceIcon /></IconButton>
              }
              { props.match.team2Id !== null && props.match.winnerId === null && !props.tournament.hasEnded && props.user.isLoggedIn &&
              <IconButton onClick={setWinner(props.match.team2Id)} color="success" aria-label="select winner" component="span"><AddCircleIcon /></IconButton>
              }
            </Stack>
        </li>
        <li className="spacer">&nbsp;</li>
    </>
  );
}

function BracketViewer(props){
  
  const [matches, setMatches] = React.useState(null);
  const [teams, setTeams] = React.useState(null);

  React.useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + `/tournament/${props.tournamentId}/getMatches`)
      .then(res => res.json())
      .then(data => {
        if (data.status !== "OK") {
          // Do your error thing
          console.error(data);
          return;
        }
        let matches = data.data;
        // Group all matches by their round/tier
        let tiers = matches.reduce((tiers, match) => {
          if (!tiers[match.tier]) {
            tiers[match.tier] = [];
          }
          tiers[match.tier].push(match);
          return tiers;
        }, {});

        tiers = Object.values(tiers);
        tiers = tiers.reverse();
        
        setMatches(tiers);
      })
      .catch(err => showError(err));

    fetch(process.env.REACT_APP_API_URL + `/tournament/${props.tournamentId}/getTeams`)
      .then(res => res.json())
      .then(data=>{
        if(data.status !== "OK"){
          console.error(data)
          return;
        }
        let teams = data.data;
        setTeams(teams);
      })
      .catch(err => showError(err));
  }, []);
  return (
      (props.tournament && matches && teams) ?
        // <div sx={{width: "100vw", height: "80vh", overflow: "scroll"}} className="bracket">
        <div className="bracket">
          {matches.map(tier => {
            let tierNum = tier[0].tier;
            return <TournamentTier user={props.user} tournament={props.tournament} key={tierNum} tier={tierNum} matches={tier} teams={teams} />
          })}
        </div>
      : <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', position:'relative', marginTop:'5%'}}><CircularProgress size={"20vw"}/></Box>   
  );
}

let showError = (message) => {};
export default function TournamentOverview(props) {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = React.useState(false);

  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  showError = (message) => {
    setOpenError(false);
    setErrorMessage(message);
    setOpenError(true);
  }

  React.useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + `/tournament/${tournamentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status !== "OK") {
          showError(data.data);
          return;
        }
        let tourn = data.data;
        let now = new Date();
        let endTime = new Date(tourn.endTime);
        tourn.hasEnded = (now - 2*60*60*1000) > endTime; // 2 hours in the past
        setTournament(tourn);
      })
      .catch(err => showError(err));
  }, [tournamentId]);

  return (
    <>
      <Appbar user={props.user} pageTitle={tournament.name} />
      { props.user.isLoggedIn && !tournament.hasEnded && 
        <TournamentBar tournamentId={tournamentId} viewTournament={true} />
      }
      <BracketViewer tournament={tournament} user={props.user} tournamentId={tournamentId} className="bracketViewer" />
    </>
  );
}
