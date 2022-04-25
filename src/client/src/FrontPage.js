import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

import TournamentCreator from "./TournamentCreator.js";
import TournamentOverview from "./TournamentOverview.js";
import TournamentManager from "./TournamentManager.js";
import TournamentHistory from "./TournamentHistory";
import TournamentTeams from "./TournamentTeams";
import LoginPage from "./LoginPage";
import ProfilePage from "./ProfilePage";
import Appbar from './components/AsuraBar';
import SuccessSnackbar from "./components/SuccessSnackbar";
import ErrorSnackbar from "./components/ErrorSnackbar";
import AdminsOverview from "./AdminsOverview";

import { Button, Container, Typography, Box, Stack, Card, CardContent, CardMedia, Paper, Grid, Icon, TextField } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

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
        <Typography variant="body"> Starts in: </Typography>
        { remainingDays > 0 ? <Typography variant="body"> {remainingDays} days</Typography> : null }
        { remainingHours > 0 ? <Typography variant="body"> {remainingHours} hours</Typography> : null }
        { remainingMins > 0 ? <Typography variant="body"> {remainingMins} mins</Typography> : null }
        { remainingSecs > 0 ? <Typography variant="body"> {remainingSecs} secs</Typography> : null }
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
              <Typography variant="body" color="text.primary"><EmojiEventsIcon alt="A trohpy" color="gold"/>  Prize: {props.tournament.prize} </Typography>
              <Countdown />
              
              <Box sx={{flexGrow: 1, marginTop: "20px"}}>
                <Grid container spacing={4} justifyContent="center" wrap="wrap">
                    { props.user.isLoggedIn ?
                      <Grid item>
                      <Link to={`/tournament/${props.tournament.id}/manage`}>
                        <Button className="ManageButton" variant="contained" color="primary" endIcon={<EditIcon />}>Edit Tournament</Button>
                      </Link>
                    </Grid> : null
                    }
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

function TournamentList(props) {
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
          if(today - tournaments[i].endTime <= 2*60*60*1000) {
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
    {tournamentList && tournamentList.map((tournamentObject) => <TournamentListItem user={props.user} key={tournamentObject.id.toString()} tournament={tournamentObject} />)}
  </Stack>
  </>;
}

function Home(props) {
  return (
    <>
      <Appbar user={props.user} pageTitle="Asura Tournaments" />
        <Container sx={{minHeight: "30vh", width: "90vw", padding: "20px 20px"}} component={Container} direction="column" align="center">
          <Box component={Stack} direction="row" align="center" justifyContent="space-between" alignItems="center" sx={{flexGrow: 1}}>
            <Typography sx={{fontSize:['1.5rem','2rem','2rem']}}>Tournaments</Typography>
            { props.user.isLoggedIn ?
              <CreateButton /> : null
            }
          </Box>
          <TournamentList user={props.user} />
          {props.user.isLoggedIn &&
            <Typography variant="h5" color="#555555">
              Finished tournaments are moved to the <Link to="/history">history-page</Link>
            </Typography>
          }
        </Container>
    </>
  );
}


let showSuccess = (message) => {};
let showError = (message) => {};

export default function App() {
  const [user, setUser] = React.useState({});
  // let fetchUser = () => {
  //   fetch(process.env.REACT_APP_API_URL + `/users/getSavedUser`)
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.status !== "OK") {
  //         setUser({ isManager: false, isLoggedIn: false });
  //         console.log(data.data); // "No user logged in"
  //         return;
  //       }
  //       let u  = data.data;
  //       u.isLoggedIn = true;
  //       console.log("User is logged in")
  //       setUser(u);
  //     })
  //     .catch((err) => {
  //       showError(err.message);
  //       setUser({ isManager: false, isLoggedIn: false });
  //     });
  // }
  // // Debug mode, allow all:
  let fetchUser = () => {
    setUser({
      name: "TEST USERTEST",
      isManager: true,
      isLoggedIn: true,
      email: "testesen@gmail.com",
      asuraId: "123456789",
      googleId: "234"
    });
  }

  React.useEffect(() => {
    fetchUser();
  }, []);

  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  showError = (message) => {
    setOpenError(false);
    setErrorMessage(message);
    setOpenError(true);
  }

  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  showSuccess = (message) => {
    setOpenSuccess(false);
    setSuccessMessage(message);
    setOpenSuccess(true);
  }

  return (
    <React.StrictMode>
      <Router>
      <Routes>
        <Route path="/" element={<Home showError={showError} showSuccess={showSuccess} user={user} />} />
        <Route path="/create" element={<TournamentCreator showError={showError} showSuccess={showSuccess} user={user} />} />
        <Route path="/tournament/:tournamentId" element={<TournamentOverview user={user} />} />
        <Route path="/tournament/:tournamentId/manage" element={<TournamentManager showError={showError} showSuccess={showSuccess} user={user} />} />
        <Route path="/tournament/:tournamentId/teams" element={<TournamentTeams showError={showError} showSuccess={showSuccess} user={user} />} />
        <Route path="/history" element={<TournamentHistory showError={showError} showSuccess={showSuccess} user={user} />} />
        <Route path="/login" element={<LoginPage user={user} />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
        <Route path="/admins" element={<AdminsOverview user={user} />} />
      </Routes>
    </Router>

    <SuccessSnackbar message={successMessage} open={openSuccess} setOpen={setOpenSuccess} />
    <ErrorSnackbar message={errorMessage} open={openError} setOpen={setOpenError} />
    </React.StrictMode>
  );
}
