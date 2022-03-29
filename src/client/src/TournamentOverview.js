import * as React from "react";
import { Link } from "react-router-dom";
import Appbar from './components/appbar';
import TournamentBar from "./components/tournamentbar";
import { useParams } from 'react-router-dom'
import { Button, Paper, Stack } from "@mui/material";
import "./components/tournamentBracket.css";

function MatchPair(props) {
  let match1 = <Match teams={props.teams} match={props.matches[0]} key={0} />;
  let match2 = <Match teams={props.teams} match={props.matches[1]} key={1} />;

  return <div className="winners">
    <div className="matchups">
      {match1}
      {match2}
    </div>
    <div className="connector">
      <div className="merger"></div>
      <div className="line"></div>
    </div>
  </div>
}

function TournamentTier(props) {
  // One round/tier of the tournament, as used by BracketViewer
  let roundTypes = ["finals", "semifinals", "quarterfinals", "eighthfinals", "sixteenthfinals", "thirtysecondfinals"];
  
  if (props.tier === 0) {
    // The final, just a single match without the bracket lines
    return (
      <section className="round finals"><div className="winners">
        <div className="matchups">
          <Match teams={props.teams} match={props.matches[0]} key={0} />
        </div>
      </div>
    </section>
    );
  } else {
    // The rest of the rounds/tiers, divide into pairs of two matches
    let matchPairCount = props.matches.length / 2;
    let matchPairs = [];
    for (let i = 0; i < matchPairCount; i++) {
      matchPairs.push(<MatchPair teams={props.teams} matches={props.matches.slice(i * 2, i * 2 + 2)} key={i} />);
    }

    return (
      <section className={`round ${roundTypes[props.tier]}`}>
        {matchPairs}
      </section>
    );
  }
}

function Match(props) {
  // A single match object, as used by MatchPair and TournamentTier
  let team1Name = "TBA";
  let team2Name = "TBA";
  if (props.match.team1Id !== null) {
    team1Name = props.teams.find(team => team.id === props.match.team1Id).name;
  }
  if (props.match.team2Id !== null) {
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
          window.location.reload();
        } else {
          showError(data.data)
        }
      })
      .catch(error => showError(error));
  }

  return (
    <div className="matchup">
      <div className="participants">
        {/* Team 1 (Winner-status?) (Team name) */}
        <div onClick={setWinner(props.match.team1Id)} className={`participant ${props.match.winnerId && (props.match.team1Id === props.match.winnerId) ? "winner" : ""}`}>
          <span>{team1Name}</span>
        </div>
        {/* Team 2 (Winner-status?) (Team name) */}
        <div onClick={setWinner(props.match.team2Id)} className={`participant ${props.match.winnerId && (props.match.team2Id === props.match.winnerId) ? "winner" : ""}`}>
          <span>{team2Name}</span>
        </div>
      </div>
    </div>
  );
}

function BracketViewer(props) {
  const [tournament, setTournament] = React.useState(null);
  const [matches, setMatches] = React.useState(null);
  const [teams, setTeams] = React.useState(null);

  // One fetch statement for each of the three state variables
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
      : <div className="loader"><h2>Loading...</h2></div>     
  );
}

function showError(error) {
  alert("Something went wrong. \n" + error);
  console.error(error);
}

export default function TournamentOverview(props) {
  const { tournamentId } = useParams();

  return (
    <>
      <Appbar pageTitle="Tournament matches" />
      <TournamentBar pageTitle="Tournament Matches" />
      <BracketViewer tournamentId={tournamentId} className="bracketViewer" />
    </>
  );
}
