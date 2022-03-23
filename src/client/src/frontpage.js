import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import ManageButton from "./components/managebutton";
import CreateTournament from "./createtournament.js";
import TournamentOverview from "./tournamentoverview.js";
import TournamentManager from "./managetournament.js";
import TournamentAnnouncement from "./tournamentannouncement";
import TournamentMatches from "./tournamentmatches";
import TeamEditor from "./teameditor";
import Appbar from './components/appbar';

import { Button, Container, Typography, Grid, Box } from "@mui/material";
import { Card, CardActions,CardACtionsArea, CardContent, CardHeader, CardMedia, Collapse, Paper } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { maxWidth } from "@mui/system";

function CreateButton(props) {
  return (
    <Link to="/create" style={{ textDecoration: "none" }}>
      <Button variant="contained" color="success" style={{ margin: '2.5% 0 0 0'}}>
        <Box sx={{
          marginRight: '2%',
        }}>
          Create Tournament
        </Box>
        <AddCircleIcon />
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

function TournamentListItem(props) {
  return (
    <Container maxWidth="lg" align="start" sx={{
      margin:'2.5% 0'
    }}>
        <Paper elevation={8}>
          <Card>
            <CardMedia 
              component="img"
              alt="tournament image"
              height="140"
              image="https://source.unsplash.com/random"
            />
            <CardContent>
              <Typography variant="h3" component="div" align="center">
                {props.tournament.name}
              </Typography>
              <Typography variant="h5" color="text.primary">
                {props.tournament.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start: {props.tournament.startTime.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                End: {props.tournament.endTime.toLocaleString()}
              </Typography>
              <Typography variant="h5" color="text.primary" gutterBottom>
                Players todo / {props.tournament.teamLimit} 
              </Typography>
              <Box sx={{
                margin: 'auto',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                }} component="span">
                  <Box sx={{
                    margin: '0 2% 0 2'
                  }}>
                    <ManageButton tournamentId={props.tournament.id}/>
                  </Box>
                  <Box sx={{
                    margin: '0 2% 0 2%'
                  }}>
                    <OverviewButton />  
                  </Box>
              </Box>
            </CardContent>
          </Card>     
        </Paper>   
    </Container>
  );
}

function TournamentList() {
  let [data, setData] = React.useState(null);
  let [tournamentList, setTournamentList] = React.useState([]);

  React.useEffect(() => {
    fetch("http://10.24.1.213:3000/api/tournament/getTournaments")
      .then(res => res.json())
      .then(data => {
        
        if (data.status != "OK") {
          // Do your error thing
          console.error(data);
          return;
        }

        let tournaments = Object.values(data.data);
        for (let i = 0; i < tournaments.length; i++) {
          tournaments[i].startTime = new Date(tournaments[i].startTime);
          tournaments[i].endTime = new Date(tournaments[i].endTime);
        }

        setTournamentList(tournaments);
      })
      .catch((err) => console.log(err.message));
  }, []);

  return <>
    {/* {tournamentList && tournamentList.map((tournamentObject, i) => <TournamentListItem key={tournamentObject.id.toString()} name={tournamentObject.name} description={tournamentObject.description} startDate={tournamentObject.startTime} endDate={tournamentObject.endTime} teamLimit={tournamentObject.teamLimit} />)} */}
    {tournamentList && tournamentList.map((tournamentObject) => <TournamentListItem key={tournamentObject.id.toString()} tournament={tournamentObject} />)}
 
  </>;
}

//<ListElement name={data[i].name} competitors={data[i].teamLimit} date={data[i].startTime}/>

function Home() {
  return (
    <React.StrictMode>
      <Appbar />
      <main>
        <Container align="center">
            <CreateButton />
            <Typography variant="h2" style={{margin:'2% 0'}}>
              Tournaments
            </Typography>
            <TournamentList />
          {/* <ListElement
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
          /> */}
          
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
        <Route path="/tournament/" element={<TournamentOverview />} />
        <Route path="/tournament/:id/manage" element={<TournamentManager />} />
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
