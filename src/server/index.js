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
// #endregion