import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import HomeImage from "./components/homeimage";
import ManageButton from "./components/managebutton";

function ViewTournament(params) {
  return (
    <React.Fragment>
      <div id="touOverview"></div>
      <Link to="/tournament/teams">
        <button id="manageTeams">Manage Teams </button>
      </Link>
      <Link to="/tournament/matches">
        <button id="touMaches">Tournament Matches</button>
      </Link>
    </React.Fragment>
  );
}

export default function TournamentOverview(props) {
  return (
    <React.Fragment>
      <HomeImage />
      <ManageButton />
      <ViewTournament />
    </React.Fragment>
  );
}
