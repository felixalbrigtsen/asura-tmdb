import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import TournamentCreator from "./TournamentCreator.js";
import TournamentOverview from "./TournamentOverview.js";
import TournamentManager from "./TournamentManager.js";
import TournamentAnnouncement from "./TournamentAnnouncement";
import TournamentMatches from "./TournamentMatches";
import TournamentTeams from "./TournamentTeams";
import AppBar from './components/Appbar';
import { Button, Container, Typography, Box, Stack, Card, CardContent, CardMedia, Paper, Grid } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

function CreateButton(props) {
  return (
    <Link to="/create">
      <Button variant="contained" color="success">
        <Box sx={{
          paddingRight: '2%',
        }}>
          Create Tournament
        </Box>
        <AddCircleIcon />
      </Button>
    </Link>
  );
}

function shorten(description, maxLength) {
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + "...";
  }
  return description;
}

function TournamentListItem(props) {
  return (
        <Paper elevation={8} >
          <Card>
            <CardMedia 
              component="img"
              alt="tournament image"
              height="140"
              // image="Asura_Rex.png"
              image="banner2.png"
            />
            <CardContent align="left">
              <Typography variant="h3" component="div" align="center">{props.tournament.name} </Typography>
              <Typography variant="h5" color="text.primary">{shorten(props.tournament.description, 200)}</Typography>
              <Typography variant="body2" color="text.secondary"> Start: {props.tournament.startTime.toLocaleString()} </Typography>
              <Typography variant="body2" color="text.secondary"> End: {props.tournament.endTime.toLocaleString()} </Typography>
              <Typography variant="h5" color="text.primary" gutterBottom> Players {props.tournament.teamCount} / {props.tournament.teamLimit} </Typography>

              <Box sx={{flexGrow: 1}}>
              <Grid container spacing={4} justifyContent="center" wrap="wrap">
                  <Grid item>
                    <Link to={`/tournament/${props.tournament.id}/manage`}>
                      <Button className="ManageButton" variant="contained" color="primary">Manage Tournament</Button>
                    </Link>
                  </Grid>
                  <Grid item >
                  <Link to={`/tournament/${props.tournament.id}`} >
                    <Button variant="contained" color="success">
                      View Tournament
                    </Button>
                  </Link>
                  </Grid>
              </Grid>
              </Box>
            </CardContent>
          </Card>     
        </Paper>
  );
}

function TournamentList() {
  let [tournamentList, setTournamentList] = React.useState([]);

  React.useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + `/tournament/getTournaments`)
      .then(res => res.json())
      .then(data => {
        if (data.status !== "OK") {
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
  <Stack spacing={3} sx={{margin: "10px auto"}}>
    {tournamentList && tournamentList.map((tournamentObject) => <TournamentListItem key={tournamentObject.id.toString()} tournament={tournamentObject} />)}
  </Stack>
    
  </>;
}
function Home() {
  return (
    <>
      <AppBar pageTitle="Asura Tournaments" />
        <Container sx={{minHeight: "30vh", width: "90vw", padding: "20px 20px"}} component={Container} direction="column" align="center">
          <Box component={Stack} direction="row" align="center" justifyContent="space-between" alignItems="center" sx={{flexGrow: 1}}>
            {/* <CreateButton /> */}
            <Typography variant="h3">Tournaments</Typography>
            <CreateButton />
          </Box>
          <TournamentList />
        </Container>
    </>
  );
}

export default function App() {
  return (
    <React.StrictMode>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<TournamentCreator />} />
        <Route path="/tournament/:tournamentId" element={<TournamentOverview />} />
        <Route path="/tournament/:tournamentId/manage" element={<TournamentManager />} />
        <Route path="/tournament/:tournamentId/teams" element={<TournamentTeams />} />
        <Route path="/tournament/matches" element={<TournamentMatches />} />
        <Route
          path="/tournament/manage/announcement"
          element={<TournamentAnnouncement />}
        />
      </Routes>
    </Router>
    </React.StrictMode>
  );
}
