const path = require("path");
const express = require("express");
const mysql = require("mysql");
require("dotenv").config();
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

const Match = require("./match.js");

const app = express();
const port = 3000;
app.engine('html', require('ejs').renderFile);
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "landing.html"));
});

app.get("/tournament/:tournamentId/getMatches", (req, res) => {
  let tournamentId = req.params.tournamentId;
  if (isNaN(tournamentId)) {
    res.json({"status": "error", "data": "tournamentId must be a number"});
    return
  }
  tournamentId = parseInt(tournamentId);
  getMatchesByTournamentId(tournamentId)
    .then(matches => res.send({"status": "OK", "data": matches}))
    .catch(err => res.send({"status": "error", "data": err}));
});

// app.get("/getMatches", (req, res) => {
//   connection.query("SELECT * FROM matches", (err, matches) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(matches);
//     }
//   });
// });

// app.get("/tournament/:tournamentId", (req, res) => {
//   res.render(path.join(__dirname, "public", "tournament.html"), {"tournament":tournaments[req.params.tournamentId]});
// });

function getMatchesByTournamentId(tournamentId) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM matches WHERE tournament_id = ?", [mysql.escape(tournamentId)], (err, matches) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });
}
