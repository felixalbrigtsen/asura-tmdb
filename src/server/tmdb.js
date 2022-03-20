// TMDB - Tournament Manager DataBase
// Handles all the database operations for the Tournament Manager
// Exports the following functions:
module.exports = {
  getMatchesByTournamentId: getMatchesByTournamentId,
  getTournaments: getTournaments,
  getMatch: getMatch,
  setMatchWinner: setMatchWinner,
}

const { query } = require("express");
const mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

function getMatchesByTournamentId(tournamentId) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM matches WHERE tournamentId = ?", [mysql.escape(tournamentId)], (err, matches) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });
}

function getTournaments() {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM tournaments", (err, tournaments) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(tournaments);
      }
    });
  });
}

// Returns the match of the exact given id.
function getMatch(matchId) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM matches WHERE id = ?", [mysql.escape(matchId)], (err, matches) => {
      if (err) {
        reject(err);
      } else {
        if (matches.length == 0) {
          reject("No such match exists");
        }
        resolve(matches[0]);
      }
    });
  });
}

// Removes a given team from a given match. This is done by setting the teamId-property containing the given team to null.
function unsetContestant(matchId, teamId) {
  let match = getMatch(matchId);
  if (match.team1Id == teamId) {
    connection.query("UPDATE matches SET team1Id = NULL WHERE id = ?", [mysql.escape(matchId)], (err, result) => {
      if (err) { console.log(err); }
    });
  } else if (match.team2Id == teamId) {
    connection.query("UPDATE matches SET team2Id = NULL WHERE id = ?", [mysql.escape(matchId)], (err, result) => {
      if (err) { console.log(err); }
    });
  } else {
    console.log("Error: Team not found in match");
  }
}

// Sets the winnerId-property of a given match.
// Also appoints the winner as a contestant to the next(parent) match.
function setMatchWinner(matchId, winnerId) {
  return new Promise(function(resolve, reject) {
    getMatch(matchId)
      .catch(err => reject(err))
      .then(match => {
        if (winnerId != match.team1Id && winnerId != match.team2Id) {
          reject("Winner must be one of the teams in the match");
        }

        // Final match doesn't have a parent
        if (match.parentMatchId != null) {
          // Enter the winner of the match into the parent match
          getMatch(match.parentMatchId)
            .catch(err =>reject(err))
            .then(parentMatch => {
              if (parentMatch.team1Id == null) {
                connection.query("UPDATE matches SET team1Id = ? WHERE id = ?", 
                [mysql.escape(winnerId), mysql.escape(parentMatch.id)], (err, sets) => {
                  if (err) { reject(err); }
                });
              } else if (parentMatch.team2Id == null) {
                connection.query("UPDATE matches SET team2Id = ? WHERE id = ?", 
                [mysql.escape(winnerId), mysql.escape(parentMatch.id)], (err, sets) => {
                  if (err) { reject(err); }
                });
              } else {
                reject("Parent match already has two teams");
              }
          });
        }

        // Lastly, if all checks passed, actually set the winnerId property
        connection.query("UPDATE matches SET winnerId = ? WHERE id = ?", 
        [mysql.escape(winnerId), mysql.escape(matchId)], (err, sets) => {
          if (err) {
            // If this update fails, we need to undo the parent match update
            unsetContestant(parentMatchId, winnerId);
            reject(err);
          }
          getMatch(matchId)
            .catch(err => reject(err))
            .then(match => resolve(match));
        });

      });
  });
}


// Dangerous function, use with caution. 
// Used to initialize and manage the database by management tools, not by the main application.
function executeStatement(statement) {
  return new Promise(function(resolve, reject) {
    connection.query(statement, (err, sets) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(sets);
      }
    });
  });
}