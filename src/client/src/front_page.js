import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Manage_Button from "./components/manage_button";
import Create_Tournament from "./create_tournament.js";
import Tournament_Overview from "./tournament_overview.js";
import Tournament_Manager from "./manage_tournament.js";
import Home_Image from "./components/home_image";

import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-boostrap/Button'
import Container from 'react-boostrap/Container'
import Card from 'react-boostrap/Card'

function Create_Button(props) {
  return (
    <Button className="Create_Button" variant='primary'>
      <Link to="/create">Create Tournament</Link>
    </Button>
  );
}

function Overview_Button(props) {
  return (
    <Button className="Overview_Button" variant='secondary'>
      <Link to="/tournament">View Tournament</Link>
    </Button>
  );
}

function ListElement(props) {
  return (
    <Container>
      <Card className="ListElement">
        <div className="tournamentDetails">
          {props.name}, {props.competitors} competitors, Date: {props.date}
        </div>
        <Manage_Button />
        <Overview_Button />
      </Card>
    </Container>
  );
}

function Home() {
  return (
    <React.StrictMode>
      <Home_Image />
      <Create_Button />
      <Card id="tournamentList">
        <ListElement name="Weekend Warmup" competitors="16" date="29.04.2022" />
        <ListElement
          name="Saturday Showdown"
          competitors="8"
          date="30.04.2022"
        />
        <ListElement name="Sunday Funday" competitors="64" date="01.05.2022" />
      </Card>
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
