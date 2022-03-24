import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Appbar from './components/appbar';
import { useParams } from 'react-router-dom'
import { Button } from "@mui/material";
import TournamentBracket from "./components/tournamentBracket";

function TournamentTier(props) {
  let roundTypes = ["finals", "semifinals", "quarterfinals", "eighthfinals"];
  let connector;
  if (props.tier != 0) {
    connector = <div className="connector">
      <div className="merger"></div>
      <div className="line"></div>
    </div>;
  }

  return <section className={`round ${roundTypes[props.tier]}`}><div className="winners">
        <div className="matchups">
          {props.matches.map((match, i) => {
            return <Match teams={props.teams} match={match} key={i} />
          })}
        </div>
        {connector}
      </div>
    </section>
}

function Match(props) {
  let team1;
  let team2;
  if (props.match.team1Id != null) {
    team1 = <div className='participant'><span>{props.match.team1Id}</span></div>;
  } else {
    team1 = <div className='participant'><span>TBA</span></div>;
  }
  
  if (props.match.team2Id != null) {
    team2 = <div className='participant'><span>{props.match.team2Id}</span></div>;
  } else {
    team2 = <div className='participant'><span>TBA</span></div>;
  }

  return <div className="matchup">
    <div className="participants">
      {/* <div class="participant winner"><span>{if (props.match.team1Id) { props.match.team1Id} else { "TBA" }}</span></div>
      <div class="participant"><span>{props.match.team2Id}</span></div> */}
      {team1}
      {team2}
    </div>
  </div>;
}

function BracketViewer(props) {
  const [tournament, setTournament] = React.useState(null);
  const [matches, setMatches] = React.useState([]);
  const [teams, setTeams] = React.useState([]);
  React.useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_URL + `/api/tournament/${props.tournamentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status != "OK") {
          // Do your error thing
          console.error(data);
          return;
        }
        let tournament = data.data;
        setTournament(tournament);
      })
      .catch((err) => console.log(err.message));


    fetch(process.env.REACT_APP_BACKEND_URL + `/api/tournament/${props.tournamentId}/getMatches`)
      .then(res => res.json())
      .then(data => {
        if (data.status != "OK") {
          // Do your error thing
          console.error(data);
          return;
        }
        let matches = data.data;
        let tiers = matches.reduce((tiers, match) => {
          if (tiers[match.tier] == undefined) {
            tiers[match.tier] = [];
          }
          tiers[match.tier].push(match);
          return tiers;
        }, {});

        tiers = Object.values(tiers);
        tiers = tiers.reverse();
        
        setMatches(tiers);
      })
      .catch((err) => console.log(err.message));

    fetch(process.env.REACT_APP_BACKEND_URL + `/api/tournament/${props.tournamentId}/getTeams`)
      .then(res => res.json())
      .then(data=>{
        if(data.status != "OK"){
          console.error(data)
          return;
        }
        let teams = data.data;
        setTeams(teams);
      })
      .catch((err) => console.log(err.message));
    
  }, []);

  return <div className="bracket">
    {matches.map(tier => {
      let tierNum = tier[0].tier;
      return <TournamentTier key={tierNum} tier={tierNum} matches={tier} teams={teams} />

    })}
  </div>;
}

export default function TournamentOverview(props) {
  // Use-effect hook here
  const { tournamentId } = useParams();

  return (
    <>
      <Appbar />
      <Link to={`/tournament/${tournamentId}/manage`}>
        <Button className="ManageButton" variant="contained" color="rackley">Manage Tournament</Button>
      </Link>
      <Link to={`/tournament/${tournamentId}/teams`}>
        <Button className="OverviewButton" variant="contained" color="grape">
          Manage Teams
        </Button>
      </Link>

      <BracketViewer tournamentId={tournamentId} className="bracketViewer" />
    </>
  );
}
