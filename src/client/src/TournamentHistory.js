import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { Button, Container, Typography, Box, Stack, Card, CardContent, CardMedia, Paper, Grid, Icon, TextField } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import Appbar from './components/AsuraBar';
import LoginPage from './LoginPage';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';


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
                
                <Typography variant="h5" color="text.primary" gutterBottom> Participants: {props.tournament.teamCount} / {props.tournament.teamLimit} </Typography>
                <Description />
                <Typography variant="body" color="text.primary"><EmojiEventsIcon alt="A trohpy" color="gold" align="vertical-center"/>  Prize: {props.tournament.prize} </Typography>

                <Box sx={{flexGrow: 1, marginTop: "20px"}}>
                  <Grid container spacing={4} justifyContent="center" wrap="wrap">
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
    let [originalList, setOriginalList] = React.useState([])
  
    React.useEffect(() => {
      fetch(process.env.REACT_APP_API_URL + `/tournament/getTournaments`)
        .then(res => res.json())
        .then(data => {
          if (data.status !== "OK") {
            console.error(data);
            return;
          }

          let tournamenthistory = []
          let today = new Date()
          let tournaments = Object.values(data.data);
          for (let i = 0; i < tournaments.length; i++) {
            tournaments[i].startTime = new Date(tournaments[i].startTime);
            tournaments[i].endTime = new Date(tournaments[i].endTime);
            if(today - tournaments[i].endTime >= 2*60*60*1000) {
                tournamenthistory.push(tournaments[i])
            }
          }

          setTournamentList(tournamenthistory);
          setOriginalList(tournamenthistory)
        })
        .catch((err) => console.log(err.message));
    }, []);

  function search() {
    let searchBase = []
    let searchResult = []
    originalList.map((tournament) => searchBase.push(tournament.name))
    let input = document.getElementById("searchInput")
    let inputUpperCase = input.value.toUpperCase()
    for (let i = 0; i < searchBase.length; i++) {
      let tournamentName = searchBase[i].toUpperCase()
      if(tournamentName.indexOf(inputUpperCase) >= 0) {
        searchResult.push(tournamentName)
      }
    }

    let searchedList = []
    for (let i = 0; i < originalList.length; i++) {
      let name = originalList[i].name
      for (let j = 0; j < searchResult.length; j++) {
        if (name.toUpperCase() == searchResult[j]) {
          searchedList.push(originalList[i])
        }
      }
    }

    if (input.value == "") {
      setTournamentList(originalList)
    } else {
      setTournamentList(searchedList)
    }
  }
  
    return <>
    <TextField type="text" id="searchInput" label="Search" placeholder="Tournament Name" InputLabelProps={{shrink: true}} onChange={search}/>
    <Stack spacing={3} sx={{margin: "10px auto"}}>
      {tournamentList && tournamentList.map((tournamentObject) => <TournamentListItem key={tournamentObject.id.toString()} tournament={tournamentObject} />)}
    </Stack>
      
    </>;
  }

export default function TournamentHistory(props) {
  if (!props.user.isLoggedIn) { return <LoginPage user={props.user} />; }
  return (
      <>
        <Appbar user={props.user} pageTitle="Tournament History" />
          <Container sx={{minHeight: "30vh", width: "90vw", padding: "20px 20px"}} component={Container} direction="column" align="center">
            <Box component={Stack} direction="row" align="center" justifyContent="center" alignItems="center" sx={{flexGrow: 1, margin:'2.5% 0'}}>
              <Typography sx={{fontSize:['1.5rem','2rem','2rem']}}>Past Tournaments</Typography>
            </Box>
            <TournamentList />
          </Container>
      </>
    );
}