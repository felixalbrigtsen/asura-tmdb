const path = require("path");
const express = require("express");
require("dotenv").config();

// Our self-written module for handling database operations
let tmdb = require("./tmdb.js");

// #region Express setup
const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let api = express.Router();
// app.use("/api", api);
app.use("/api", api);

api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
api.use(require('express-log-url'));

// #endregion

// #region frontend

// api.get("/", (req, res) => {
//   res.redirect("https://asura.feal.no/");
// });
// Serve static files from the React app
app.use('/', express.static(path.join(__dirname, 'clientbuild')));
// app.use('/tournament/', express.static(path.join(__dirname, 'clientbuild', 'index.html')));
app.use('/tournament/*', express.static(path.join(__dirname, 'clientbuild', 'index.html')));
app.use('/static', express.static(path.join(__dirname, 'clientbuild/static')));
app.use('/static/*', express.static(path.join(__dirname, 'clientbuild/static')));
// app.get('/*', function (req, res) {
  // res.sendFile(path.join(__dirname, 'clientbuild', 'index.html'));
// });
// app.use('/*', express.static(path.join(__dirname, 'clientbuild')));

// #endregion

// #region API
api.get("/tournament/getTournaments", (req, res) => {
  tmdb.getTournaments()
  .then(tournaments => res.json({"status": "OK", "data": tournaments}))
  .catch(err => res.json({"status": "error", "data": err}));
});

// #region tournament/:tournamentId
api.get("/tournament/:tournamentId", (req, res) => {
  let tournamentId = req.params.tournamentId;
  if (isNaN(tournamentId)) {
    res.json({"status": "error", "data": "Invalid tournament id"});
    return;
  }
  tmdb.getTournament(parseInt(tournamentId))
    .catch(err => res.json({"status": "error", "data": err}))
    .then(tournament => res.json({"status": "OK", "data": tournament}));
});

api.get("/tournament/:tournamentId/getMatches", (req, res) => {
  let tournamentId = req.params.tournamentId;
  if (isNaN(tournamentId)) {
    res.json({"status": "error", "data": "tournamentId must be a number"});
    return
  }
  tournamentId = parseInt(tournamentId);
  tmdb.getMatchesByTournamentId(tournamentId)
  .then(matches => res.send({"status": "OK", "data": matches}))
  .catch(err => res.send({"status": "error", "data": err}));
});

api.get("/tournament/:tournamentId/getTeams", (req, res) => {
  let tournamentId = req.params.tournamentId;
  if (!tournamentId || isNaN(tournamentId)) {
    res.json({"status": "error", "data": "tournamentId must be a number"});
    return
  }
  tournamentId = parseInt(tournamentId);
  tmdb.getTeamsByTournamentId(tournamentId)
    .then(teams => res.send({"status": "OK", "data": teams}))
    .catch(err => res.send({"status": "error", "data": err}));
});
// #endregion

// #region match/:matchId


api.get("/match/:matchId", (req, res) => {
  let matchId = req.params.matchId;
  if (isNaN(matchId)) {
    res.json({"status": "error", "data": "matchId must be a number"});
    return
  }
  matchId = parseInt(matchId);
  tmdb.getMatch(matchId)
  .then(match => res.send({"status": "OK", "data": match}))
  .catch(err => res.send({"status": "error", "data": err}));
});

api.post("/match/:matchId/setWinner", (req, res) => {
  let matchId = req.params.matchId;
  let winnerId = req.body.winnerId;
  if (isNaN(matchId)) {
    res.json({"status": "error", "data": "matchId must be a number"});
    return
  }
  if (winnerId == undefined || isNaN(winnerId)) {
    res.json({"status": "error", "data": "winnerId must be a number"});
    return
  }
  
  matchId = parseInt(matchId);
  winnerId = parseInt(winnerId);
  tmdb.setMatchWinner(matchId, winnerId)
  .then(match => res.send({"status": "OK", "data": match}))
  .catch(err => res.send({"status": "error", "data": err}));
});
// #endregion

// #region team/:teamId
api.get("/team/:teamId", (req, res) => {
  let teamId = req.params.teamId;
  if (isNaN(teamId)) {
    res.json({"status": "error", "data": "teamId must be a number"});
    return
  }
  teamId = parseInt(teamId);
  tmdb.getTeam(teamId)
  .then(match => res.send({"status": "OK", "data": match}))
  .catch(err => res.send({"status": "error", "data": err}));
});

api.post("/team/:teamId/edit", (req, res) => {
  let teamId = req.params.teamId;
  let teamName = req.body.name;
  console.log(req.body);
  if (isNaN(teamId)) {
    res.json({"status": "error", "data": "teamId must be a number"});
    return
  }
  if (teamName == undefined || teamName == "") {
    res.json({"status": "error", "data": "teamName must be a non-empty string"});
    return
  }
  teamId = parseInt(teamId);
  tmdb.editTeam(teamId, teamName)
    .then(match => res.send({"status": "OK", "data": match}))
    .catch(err => res.send({"status": "error", "data": err}));
});
  

// #endregion

//Takes JSON body
api.post("/tournament/create", (req, res) => {
  //Check that req body is valid
  if (req.body.name == undefined || req.body.name == "") {
    res.json({"status": "error", "data": "No data supplied"});
    return
  }
  //Check that req is json  
  // if (req.get("Content-Type") != "application/json") {
  console.log(req.get("Content-Type"));
  let name = req.body.name;
  let description = req.body.description;
  let teamLimit = req.body.teamLimit;
  let startDate = req.body.startDate; //TODO: timezones, 2 hr skips
  let endDate = req.body.endDate;
  if (name == undefined || name == "" || description == undefined || description == "") {
    res.json({"status": "error", "data": "name and description must be provided"});
    return
  }
  if (teamLimit == undefined ) {
    res.json({"status": "error", "data": "teamLimit must be provided"});
    return
  }
  try {
    teamLimit = parseInt(teamLimit);
  } catch (err) {
    res.json({"status": "error", "data": "teamLimit must be a number"});
    return
  }
  if (startDate == undefined || endDate == undefined) {
    res.json({"status": "error", "data": "startDate and endDate must be defined"});
    return
  }
  try {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
  } catch (err) {
    res.json({"status": "error", "data": "startDate and endDate must be valid dates"});
    return
  }
  let today = new Date();
  if (startDate < today) {
    res.json({"status": "error", "data": "startDate cannot be in the past"});
    return
  }
  if (startDate > endDate) {
    res.json({"status": "error", "data": "startDate cannot be after endDate"});
    return
  }

  tmdb.createTournament(name, description, startDate, endDate, teamLimit)
    .then(msg => res.json({"status": "OK", "data": msg}))
    .catch(err => res.json({"status": "error", "data": err}));
    
});

api.post("/tournament/:tournamentId/edit", (req, res) => {
  let tournamentId = req.params.tournamentId;
  if (isNaN(tournamentId)) {
    res.json({"status": "error", "data": "tournamentId must be a number"});
    return
  }
  tournamentId = parseInt(tournamentId);
  let name = req.body.name;
  let description = req.body.description;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  console.log(startDate);
  if (name == undefined || name == "" || description == undefined || description == "") {
    res.json({"status": "error", "data": "name and description must be provided"});
    return
  }
  if (startDate == undefined || endDate == undefined) {
    res.json({"status": "error", "data": "startDate and endDate must be defined"});
    return
  }
  try {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
  } catch (err) {
    res.json({"status": "error", "data": "startDate and endDate must be valid dates"});
    return
  }
  // let today = new Date();
  // if (startDate < today) {
  //   res.json({"status": "error", "data": "startDate cannot be in the past"});
  //   return
  // }
  if (startDate > endDate) {
    res.json({"status": "error", "data": "startDate cannot be after endDate"});
    return
  }

  tmdb.editTournament(tournamentId, name, description, startDate, endDate)
    .then(msg => res.json({"status": "OK", "data": msg}))
    .catch(err => res.json({"status": "error", "data": err}));
    
});

api.post("/tournament/:tournamentId/createTeam", (req, res) => {
  let tournamentId = req.params.tournamentId;
  if (isNaN(tournamentId)) {
    res.json({"status": "error", "data": "tournamentId must be a number"});
    return;
  }
  tournamentId = parseInt(tournamentId);
  let teamName = req.body.name;
  if (teamName == undefined || teamName == "") {
    res.json({"status": "error", "data": "teamName must be a non-empty string"});
    return;
  }
  
  tmdb.createTeam(tournamentId, teamName)
    .then(msg => res.json({"status": "OK", "data": msg}))
    .catch(err => res.json({"status": "error", "data": err}));
});
    
  
// #endregion
