import * as React from "react";
import { Link } from "react-router-dom";
import Appbar from './components/AsuraBar';
import TournamentBar from "./components/TournamentBar";
import { useParams } from 'react-router-dom'
import { Button, Paper, Stack, CircularProgress, Box, Grid } from "@mui/material";
import "./components/tournamentBracket.css";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

function showError(error) {
  alert("Something went wrong. \n" + error);
  console.error(error);
}

function TournamentTier(props){
  let roundTypes = ["finals", "semifinals", "quarterfinals", "eighthfinals", "sixteenthfinals", "thirtysecondfinals"];
    let matches = [];
    for (let i = 0; i < props.matches.length; i++) {
      matches.push(<Match teams={props.teams} match={props.matches[i]} key={i} />);
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
    console.log(teamId)
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
  }

  return (
    <>
        {/* Team 1 (Winner-status?) (Team name) */}
        <li onClick={setWinner(props.match.team1Id)} className={`game game-top ${props.match.winnerId && (props.match.team1Id === props.match.winnerId) ? "winner"  : ""}`}>
          {team1Name} <span><EmojiEventsIcon alt="A trohpy"/></span>
        </li>
        <li className="game game-spacer">&nbsp;</li>
        {/* Team 2 (Winner-status?) (Team name) */}
        <li onClick={setWinner(props.match.team2Id)} className={`game game-bottom ${props.match.winnerId && (props.match.team2Id === props.match.winnerId) ? "winner" : ""}`}>
          {team2Name} <span><EmojiEventsIcon alt="A trohpy"/></span>
        </li>
        <li className="spacer">&nbsp;</li>
    </>
  );


}

function BracketViewer(props){
  const [tournament, setTournament] = React.useState(null);
  const [matches, setMatches] = React.useState(null);
  const [teams, setTeams] = React.useState(null);

  React.useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + `/tournament/${props.tournamentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status !== "OK") {
          // Do your error thing
          console.error(data);
          return;
        }
        let tournament = data.data;
        setTournament(tournament);
      })
      .catch(err => showError(err));


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
    (matches && teams) ?
      // <div sx={{width: "100vw", height: "80vh", overflow: "scroll"}} className="bracket">
      <div className="bracket">
        {matches.map(tier => {
          let tierNum = tier[0].tier;
          return <TournamentTier key={tierNum} tier={tierNum} matches={tier} teams={teams} />
        })}
      </div>
    : <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', position:'relative', marginTop:'5%'}}><CircularProgress size={"20vw"}/></Box>   
);
}

export default function TournamentOverview(props) {
  const { tournamentId } = useParams();

  return (
    <>
      <Appbar pageTitle="View Tournament" />
      <TournamentBar pageTitle="View Tournament" />
      <BracketViewer tournamentId={tournamentId} className="bracketViewer" />
    </>
  );
}
