import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Manage_Button from "./components/manage_button";
import Tournament_Manager from "./manage_tournament.js";

function Overview_Button(props) {
  return (
    <button className="Overview_Button">
      <Link to="/tournament">View Tournament</Link>
    </button>
  );
}

function ListElement(props) {
  return (
    <div>
      <div className="ListElement">
        <div className="tournamentDetails">
          {props.name}, {props.competitors} competitors, Date: {props.date}
        </div>
        <Manage_Button />
        <Overview_Button />
      </div>
    </div>
  );
}

function Home() {
  return (
    <React.StrictMode>
      <div id="tournamentList">
        <ListElement name="Weekend Warmup" competitors="16" date="29.04.2022" />
        <ListElement
          name="Saturday Showdown"
          competitors="8"
          date="30.04.2022"
        />
        <ListElement name="Sunday Funday" competitors="64" date="01.05.2022" />
      </div>
    </React.StrictMode>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tournament/manage" element={<Tournament_Manager />} />
      </Routes>
    </Router>
  );
}
