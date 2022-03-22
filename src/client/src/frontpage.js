import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import ManageButton from "./components/managebutton";
import CreateTournament from "./createtournament.js";
import TournamentOverview from "./tournamentoverview.js";
import TournamentManager from "./managetournament.js";
import HomeImage from "./components/homeimage";

import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function CreateButton(props) {
  return (
    <Link to="/create">
      <Button variant="primary">Create Tournament</Button>
    </Link>
  );
}

function OverviewButton(props) {
  return (
    <Button variant="secondary">
      <Link to="/tournament">View Tournament</Link>
    </Button>
  );
}

function ListElement(props) {
  return (
    <Container>
      <Row>
        <Col xs={6}>
          {props.name}, {props.competitors} competitors, Date: {props.date}
        </Col>
        <Col>
          <ManageButton />
        </Col>
        <Col>
          <OverviewButton />
        </Col>
      </Row>
    </Container>
  );
}

function Home() {
  return (
    <React.StrictMode>
      <HomeImage />
      <CreateButton />
      <Container>
        <ListElement name="Weekend Warmup" competitors="16" date="29.04.2022" />
        <ListElement
          name="Saturday Showdown"
          competitors="8"
          date="30.04.2022"
        />
        <ListElement name="Sunday Funday" competitors="64" date="01.05.2022" />
      </Container>
    </React.StrictMode>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateTournament />} />
        <Route path="/tournament" element={<TournamentOverview />} />
        <Route path="/tournament/manage" element={<TournamentManager />} />
      </Routes>
    </Router>
  );
}
