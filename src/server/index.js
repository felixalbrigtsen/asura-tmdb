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

app.get("/getMatches", (req, res) => {
  connection.query("SELECT * FROM matches", (err, matches) => {
    if (err) {
      console.log(err);
    } else {
      res.send(matches);
    }
  });
});


let tournaments = {
  "1": {
    "name": "Tournament 1",
    "description": "This is the first tournament",
    "matches":[
      {"id": "2",
      "player1": "Player 1",
      "player2": "Player 2",
      "winner": "Player 1",
    }
    ]
  },
  "2": { 
    "name": "Tournament 2",
    "description": "This is the second tournament",
    "matches":[
        {"id": "2",
        "player1": "Player 1",
        "player2": "Player 2",
        "winner": "Player 1",
      }]
    }
};
app.get("/tournament/:tournamentId", (req, res) => {
  res.render(path.join(__dirname, "public", "tournament.html"), {"tournament":tournaments[req.params.tournamentId]});
});


