import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import HomeImage from "./components/homeimage";
import ManageButton from "./components/managebutton";
import CreateTournament from "./createtournament.js";
import TournamentOverview from "./tournamentoverview.js";
import TournamentManager from "./managetournament.js";
import TournamentAnnouncement from "./tournamentannouncement";
import TournamentMatches from "./tournamentmatches";
import TeamEditor from "./teameditor";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

function CreateButton(props) {
  return (
    <Link to="/create" style={{ textDecoration: "none" }}>
      <Button variant="contained" color="primary">
        Create Tournament
      </Button>
    </Link>
  );
}

function OverviewButton(props) {
  return (
    <Link to="/tournament" style={{ textDecoration: "none" }}>
      <Button variant="contained" color="success">
        View Tournament
      </Button>
    </Link>
  );
}

function ListElement(props) {
  return (
    <Container maxWidth="lg" align="start">
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Typography noWrap>
            {props.name}, {props.competitors} competitors, Date: {props.date}
          </Typography>
        </Grid>
        <Grid item>
          <ManageButton />
        </Grid>
        <Grid item>
          <OverviewButton />
        </Grid>
      </Grid>
    </Container>
  );
}

function TournamentList() {
  let [data, setData] = React.useState(null);
  React.useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log("oopsie"));
  }, []);
  return <div>{data && data.map((id) => console.log(id))}</div>;
}

function Home() {
  return (
    <React.StrictMode>
      <CssBaseline />
      <AppBar position="relative" color="primary">
        <Toolbar>
          <HomeImage className="mainIcon" />
          <Typography>This is an Appbar</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container>
          <Box>
            <CreateButton />
          </Box>
          <ListElement
            name="Weekend Warmup"
            competitors="16"
            date="29.04.2022"
          />
          <ListElement
            name="Saturday Showdown"
            competitors="8"
            date="30.04.2022"
          />
          <ListElement
            name="Sunday Funday"
            competitors="64"
            date="01.05.2022"
          />
          <TournamentList />
        </Container>
      </main>
      <footer className="footer"></footer>
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
        <Route path="/tournament/teams" element={<TeamEditor />} />
        <Route path="/tournament/matches" element={<TournamentMatches />} />
        <Route
          path="/tournament/manage/announcement"
          element={<TournamentAnnouncement />}
        />
      </Routes>
    </Router>
  );
}
