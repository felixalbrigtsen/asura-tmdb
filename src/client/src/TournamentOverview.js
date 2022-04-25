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
import { fontSize } from "@mui/system";

function TournamentTier(props){
  let roundTypes = ["finals", "semifinals", "quarterfinals", "eighthfinals", "sixteenthfinals", "thirtysecondfinals"];
    let matches = [];
      for (let i = 0; i < props.matches.length; i++) {
        matches.push(<Match tournament={props.tournament} user={props.user} tier={props.tier} roundTypes={roundTypes} teams={props.teams} match={props.matches[i]} key={i} onwinnerchange={props.onwinnerchange} />);
      }
      return(
        <>
        <Box className={`round ${roundTypes[props.tier]}`} sx={{width:['100px', '150px', '200px', '250px', '400px']}}>
          <li className="spacer">&nbsp;</li>
          {matches}
        </Box>
        </>
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
          props.onwinnerchange();
        } else {
          showError(data.data)
        }
      })
      .catch(error => showError(error));
  };

  let curryUnsetContestant = teamId => (e) => {
    let formData = new FormData();
    formData.append("teamId", teamId);
    let body = new URLSearchParams(formData);
    fetch(process.env.REACT_APP_API_URL + `/match/${props.match.id}/unsetContestant`, {
      method: "POST", 
      body: body
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "OK") {
          props.onwinnerchange()
        } else {
          showError(data.data);
        }
      })
      .catch(error => showError(error));
  }

  return (
    <>
        {/* Team 1 (Winner-status?) (Team name) */}
        <li className={`game game-top`}>
          <Stack direction={"row"} alignItems="center" spacing={1}>
              <Typography noWrap className={`${props.match.winnerId !== null ? (props.match.team1Id === props.match.winnerId) ? "winner"  : "loser" : ""}`} align={'center'} sx={{ maxWidth:'70%', overflow:'hidden', wordWrap:'none', fontSize:['2vh', '1.5vh', '2vh', '3vh', '3.5vh', '4vh']}}>
                {team1Name}
              </Typography>
              { props.match.winnerId && (props.match.team1Id === props.match.winnerId) &&
              <EmojiEventsIcon alt="A trohpy" />
              }
              { props.match.team1Id !== null && !props.tournament.hasEnded && props.match.tier !== Math.log2(props.tournament.teamLimit) - 1 && props.match.winnerId === null && props.user.isLoggedIn &&
              <IconButton color="error" aria-label="remove winner" component="span" onClick={curryUnsetContestant(props.match.team1Id)}><BackspaceIcon /></IconButton>
              }
              { props.match.team1Id !== null && props.match.winnerId === null && !props.tournament.hasEnded && props.user.isLoggedIn &&
              <IconButton onClick={setWinner(props.match.team1Id)} color="success" aria-label="select winner" component="span"><AddCircleIcon /></IconButton>
              }
          </Stack>
        </li>
        <li className="game game-spacer">&nbsp;</li>
        {/* Team 2 (Winner-status?) (Team name) */}
        <li className={`game game-bottom`}>
        <Stack direction={"row"} alignItems="center">
              <Typography noWrap className={`${props.match.winnerId !== null ? (props.match.team2Id === props.match.winnerId) ? "winner" : "loser" : ""}`} sx={{maxWidth:'70%', overflow:'hidden', wordWrap:'none',fontSize:['2vh', '1.5vh', '2vh', '3vh', '3.5vh', '4vh']}}>
                {team2Name}
              </Typography>
              { props.match.winnerId && (props.match.team2Id === props.match.winnerId) &&
              <EmojiEventsIcon alt="A trohpy" />
              }
              { props.match.team2Id !== null && !props.tournament.hasEnded && props.match.tier !== Math.log2(props.tournament.teamLimit) - 1 && props.match.winnerId === null && props.user.isLoggedIn &&
              <IconButton color="error" aria-label="remove winner" component="span" onClick={curryUnsetContestant(props.match.team2Id)}><BackspaceIcon /></IconButton>
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

function WinnerDisplay(props) {
  let unsetWinner = event => {
    let formData = new FormData();
    formData.append("winnerId","null");
    let body = new URLSearchParams(formData);
    fetch(process.env.REACT_APP_API_URL + `/match/${props.finalMatch.id}/setWinner`, {
      method: "POST",
      body: body
    })
      .then(response => response.json())
      .then(data => {
        if (data.status !== "OK") { showError(data.data); return;}
        props.onwinnerchange();
      })
      .catch(error => showError(error));
  };
          


  if (!props.team) {
    // Winner is not yet chosen
    return <div className="winnerDisplay">
      <Typography variant="h5" component="h2">
        Winner is not chosen.<br /> Will it be you?
      </Typography>
    </div>;
  }

  return (
    <div className="winnerDisplay winner">
      <Typography variant="h4" component="h2" align="center">
        {props.user.isLoggedIn && <IconButton color="error" aria-label="remove winner" component="span" onClick={unsetWinner}><BackspaceIcon /></IconButton>}
        Winner:
      </Typography>
      <Typography variant="h4" component="h2">
        {props.team.name}<EmojiEventsIcon alt="A trohpy" />
      </Typography>
    </div>
  )
}

function BracketViewer(props){
  
  const [matches, setMatches] = React.useState(null);
  const [teams, setTeams] = React.useState(null);

  let getMatches = () => {
    fetch(process.env.REACT_APP_API_URL + `/tournament/${props.tournamentId}/getMatches`)
      .then(res => res.json())
      .then(data => {
        if (data.status !== "OK") {
          // Do your error thing
          console.error(data);
          return;
        }
        let allMatches = data.data;
        // Group all matches by their round/tier
        let tiers = allMatches.reduce((tiers, match) => {
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
  }
  React.useEffect(() => {
    getMatches();
  }, []);

  let getFinalMatch = (tierMatches) => {
    let finalMatch = tierMatches[tierMatches.length - 1][0];
    return finalMatch;
  };
  let getWinnerTeam = (tierMatches) => {
    let finalMatch = getFinalMatch(tierMatches);
    if (finalMatch.winnerId === null) { return null;}
    let winnerTeam = teams.find(team => team.id === finalMatch.winnerId);
    return winnerTeam;
  };
  
  return (
    
      (props.tournament && matches && teams) ?
        // <div sx={{width: "100vw", height: "80vh", overflow: "scroll"}} className="bracket">
        <>
        <div className="bracket">
        {matches.map(tierMatches => {
            let tierNum = tierMatches[0].tier;
            return <TournamentTier user={props.user} tournament={props.tournament} key={tierNum} tier={tierNum} matches={tierMatches} teams={teams} onwinnerchange={getMatches} />
          })}
        
        <WinnerDisplay team={getWinnerTeam(matches)} user={props.user} finalMatch={getFinalMatch(matches)} onwinnerchange={getMatches} />
        </div>
       </>
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
