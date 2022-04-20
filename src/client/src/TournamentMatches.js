import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Appbar from './components/Appbar';

function MatchHistory() {

  return(
    `Hei på deg din gamle sei`
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
