import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Manage_Button from "./components/manage_button";
import Create_Tournament from "./create_tournament.js";
import Tournament_Overview from "./tournament_overview.js";
import Tournament_Manager from "./manage_tournament.js";
import Home_Image from "./components/home_image";

function Create_Button(props) {
  return (
    <button className="Create_Button">
      <Link to="/create">Create Tournament</Link>
    </button>
  );
}

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
      <Home_Image />
      <Create_Button />
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
        <Route path="/create" element={<Create_Tournament />} />
        <Route path="/tournament" element={<Tournament_Overview />} />
        <Route path="/tournament/manage" element={<Tournament_Manager />} />
      </Routes>
    </Router>
  );
}
