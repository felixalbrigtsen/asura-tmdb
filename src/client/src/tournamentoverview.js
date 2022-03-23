import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import ManageButton from "./components/managebutton";
import Appbar from './components/appbar';

function RenderBrackets() {
  return (
    <>
      brackets = []
      knownTeams = [2,4,8,16,32,64,128,256]

    

    </>
  );
}

function ViewTournament(params) {
  return (
    <>
      <div id="touOverview"></div>
      <Link to="/tournament/teams">
        <button id="manageTeams">Manage Teams </button>
      </Link>
      <Link to="/tournament/matches">
        <button id="touMaches">Tournament Matches</button>
      </Link>
    </>
  );
}

export default function TournamentOverview(props) {
  return (
    <>
      <Appbar />
      <ManageButton />
      <ViewTournament />
    </>
  );
}
