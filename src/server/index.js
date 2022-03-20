const path = require("path");
const express = require("express");
require("dotenv").config();

// Our self-written module for handling database operations
let tmdb = require("./tmdb.js");

// #region Express setup
const app = express();
const port = 3000;
//app.engine('html', require('ejs').renderFile);
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// #endregion

// #region frontend
// Serve static files from the React app
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "landing.html"));
});
// #endregion

// #region API
app.get("/tournament/getTournaments", (req, res) => {
  tmdb.getTournaments()
    .then(tournaments => {res.json({"status": "OK", "data": tournaments}); })
    .catch(err => {res.json({"status": "error", "data": err}); });
});

app.get("/tournament/:tournamentId/getMatches", (req, res) => {
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

app.get("/match/:matchId/getMatch", (req, res) => {
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

// JSON body: {"winner": "teamId"}
app.post("/match/:matchId/setWinner", (req, res) => {
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