import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { Button, Container, Typography, Box, Stack, Card, CardContent, CardMedia, Paper, Grid, Icon } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import Appbar from './components/AsuraBar';

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
                
                <Typography variant="h5" color="text.primary" gutterBottom> Players: {props.tournament.teamCount} / {props.tournament.teamLimit} </Typography>
                <Description />
                
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
            if(today - tournaments[i].endTime >= 24*60*60*1000) {
                tournamenthistory.push(tournaments[i])
            }
          }

          setTournamentList(tournamenthistory);
        })
        .catch((err) => console.log(err.message));
    }, []);
  
    return <>
    <Stack spacing={3} sx={{margin: "10px auto"}}>
      {tournamentList && tournamentList.map((tournamentObject) => <TournamentListItem key={tournamentObject.id.toString()} tournament={tournamentObject} />)}
    </Stack>
      
    </>;
  }

export default function TournamentHistory() {
    return (
        <>
          <Appbar pageTitle="Tournament History" />
            <Container sx={{minHeight: "30vh", width: "90vw", padding: "20px 20px"}} component={Container} direction="column" align="center">
              <Box component={Stack} direction="row" align="center" justifyContent="space-between" alignItems="center" sx={{flexGrow: 1}}>
                <Typography variant="h3">Past Tournaments</Typography>
              </Box>
              <TournamentList />
            </Container>
        </>
      );
}