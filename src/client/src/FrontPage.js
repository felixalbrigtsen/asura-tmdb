import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import TournamentCreator from "./TournamentCreator.js";
import TournamentOverview from "./TournamentOverview.js";
import TournamentManager from "./TournamentManager.js";
import TournamentHistory from "./TournamentHistory";
import TournamentTeams from "./TournamentTeams";
import LoginPage from "./LoginPage";
import AppBar from './components/AsuraBar';
import { Button, Container, Typography, Box, Stack, Card, CardContent, CardMedia, Paper, Grid, Icon, TextField } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import EditIcon from '@mui/icons-material/Edit';

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
  const [longDescription, setLongDescription] = React.useState(false);
  const maxLength = 200;
  function toggleDescription() {
    setLongDescription(!longDescription);
  }
  function Description() {
    if (longDescription) {
      return( <Box component={Stack} direction="row">
        <Typography variant="body1" onClick={toggleDescription}>{props.tournament.description}</Typography>
        <KeyboardDoubleArrowUpIcon onClick={toggleDescription} />
      </Box> ) 
  } else if (props.tournament.description.length < maxLength) { 
    return <Typography variant="body1" color="text.secondary" onClick={toggleDescription}>{props.tournament.description}</Typography>
  } else {
      return <Box component={Stack} direction="row">
        <Typography variant="body1" color="text.secondary" onClick={toggleDescription}>{shorten(props.tournament.description, maxLength)}</Typography>
        <KeyboardDoubleArrowDownIcon onClick={toggleDescription} />
      </Box>;
    }
  }

  function Countdown() {
    const [remainingTime, setremainingTime] = React.useState(Math.abs(props.tournament.startTime - new Date()))
    React.useEffect(() => {
      const interval = setInterval(() => 
        setremainingTime(Math.abs(props.tournament.startTime - new Date()))
      , 1000);
      return () => {
        clearInterval(interval);
      };
    }, []);

    let remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    let remainingHours = Math.floor(remainingTime / (1000 * 60 * 60)) - remainingDays * 24
    let remainingMins = Math.floor(remainingTime / (1000 * 60)) - (remainingDays * 24 * 60 + remainingHours * 60)
    let remainingSecs = Math.floor(remainingTime / 1000) - (remainingDays * 24 * 60 * 60 + remainingHours * 60 * 60 + remainingMins * 60)
    if (props.tournament.startTime < new Date()) {
      return (<Box>
        <Typography variant="body"> Started! </Typography>
        </Box>)
    } else {
      return(<Box>
        { remainingDays > 0 ? <Typography variant="body"> {remainingDays} days </Typography> : null }
        { remainingHours > 0 ? <Typography variant="body"> {remainingHours} hours </Typography> : null }
        { remainingMins > 0 ? <Typography variant="body"> {remainingMins} mins </Typography> : null }
        { remainingSecs > 0 ? <Typography variant="body"> {remainingSecs} secs </Typography> : null }
      {/* <Typography variant="body"> Starts in: {remainingDays} Days, {remainingHours} Hours, {remainingMins} Minutes and {remainingSecs} Seconds </Typography> */}
      </Box>
      )
    }
  }

  return (
        <Paper elevation={8} >
          <Card>
            <CardMedia 
              component="img"
              alt="tournament image"
              height="140"
              image="banner2.png"
            />
            <CardContent align="left">
              <Typography variant="h3" component="div" align="center">{props.tournament.name} </Typography>
              
              <Box component={Stack} direction="column">
                <Typography variant="body"> Start: {props.tournament.startTime.toLocaleString()} </Typography>
                <Typography variant="body"> End: {props.tournament.endTime.toLocaleString()} </Typography>
              </Box>
              
              <Typography variant="h5" color="text.primary" gutterBottom> Players: {props.tournament.teamCount} / {props.tournament.teamLimit} </Typography>
              <Description />
              
              <Box sx={{flexGrow: 1, marginTop: "20px"}}>
                <Grid container spacing={4} justifyContent="center" wrap="wrap">
                    <Grid item>
                      <Link to={`/tournament/${props.tournament.id}/manage`}>
                        <Button className="ManageButton" variant="contained" color="primary" endIcon={<EditIcon />}>Edit Tournament</Button>
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

              <Countdown />
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

        let today = new Date()
        let currenttournaments = []
        let tournaments = Object.values(data.data);
        for (let i = 0; i < tournaments.length; i++) {
          tournaments[i].startTime = new Date(tournaments[i].startTime);
          tournaments[i].endTime = new Date(tournaments[i].endTime);
          if(today - tournaments[i].endTime <= 24*60*60*1000) {
            currenttournaments.push(tournaments[i])
          }
        }
        // tournaments.filter((tournament) => today - tournament.endTime < 24*60*60*1000)
        setTournamentList(currenttournaments);
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
          <Typography variant="h5" color="#555555">
            Finished tournaments are moved to the <Link to="/history">history-page</Link>
          </Typography>
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
        <Route path="/history" element={<TournamentHistory />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
    </React.StrictMode>
  );
}
