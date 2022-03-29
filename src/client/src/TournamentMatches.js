import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Appbar from './components/Appbar';

function MatchHistory() {

  return(
    `Hei`
  );
}

export default function TournamentMatches() {
  return (
    <>
      <Appbar />
      <MatchHistory />
    </>
  );
}
