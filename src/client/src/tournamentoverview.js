import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import ManageButton from "./components/managebutton";
import Appbar from './components/appbar';

// Test data
// {"status":"OK","data":
// [
// {"id":1,
//     "tournamentId":1,
//     "parentMatchId":null,
//     "team1Id":null,
//     "team2Id":null,
//     "winnerId":null}

function RenderBrackets(params) {
  let teams = 16;
  let groups = Math.log2(teams);
  // Number of matches, python equivalent: sum([2**groupNumber for groupNumber in range(groups)])
  let matches = [...Array(groups).keys()].map(num => Math.pow(2, num)).reduce((a, b) => a + b);
  return (
    <>
      {new Array(groups).map((group, i) => {
        return (
          <div>Group {i}</div>
        );
      })}
    </>
  );
}

function OverviewButtons(params) {
  return (
    <>
      <div id="touOverview"></div>
      <Link to="/tournament/teams">
        <button id="manageTeams">Manage Teams </button>
      </Link>
      {/* <Link to="/tournament/matches">
        <button id="touMatches">Tournament Matches</button>
      </Link> */}
    </>
  );
}

export default function TournamentOverview(props) {
  // Use-effect hook here
  return (
    <>
      <Appbar />
      <ManageButton />
      <RenderBrackets />
      <OverviewButtons />
    </>
  );
}
