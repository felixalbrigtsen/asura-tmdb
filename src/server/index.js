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
app.use("/api", api);

api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// #endregion

// #region frontend
// Serve static files from the React app
api.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "landing.html"));
});
// #endregion

// #region API
api.get("/tournament/getTournaments", (req, res) => {
  tmdb.getTournaments()
  .then(tournaments => res.json({"status": "OK", "data": tournaments}))
  .catch(err => res.json({"status": "error", "data": err}));
});

api.get("/tournament/:tournamentId", (req, res) => {
  let tournamentId = req.params.tournamentId;
  if (isNaN(tournamentId)) {
    res.json({"status": "error", "data": "Invalid tournament id"});
    return;
  }
  tmdb.getTournament(parseInt(tournamentId))
    .catch(err => res.json({"status": "error", "data": err}))
    .then(tournament => res.json({"status": "OK", "data": tournament}));
    // .then(tournament => res.json({"status": "OK", "data": tournament}));
    // .then(console.log("lol"))
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

api.get("/match/:matchId/getMatch", (req, res) => {
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

// JSON body: {"winner": teamId}
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
  let startDate = req.body.startDate;
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
    .catch(err => res.json({"status": "error", "data": err}))
    .then(msg => res.json({"status": "OK", "data": msg}));
});
// #endregion