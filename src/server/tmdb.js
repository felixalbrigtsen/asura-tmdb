// TMDB - Tournament Manager DataBase
// Handles all the database operations for the Tournament Manager
// Exports the following functions:
module.exports = {
  getMatchesByTournamentId: getMatchesByTournamentId,
  getTournaments: getTournaments,
  getTournament, getTournament,
  getTeam: getTeam,
  editTeam: editTeam,
  getMatch: getMatch,
  setMatchWinner: setMatchWinner,
  createTournament: createTournament,
  editTournament: editTournament,
  getTeamsByTournamentId: getTeamsByTournamentId,
}

const mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

function escapeString(str) {
  // return mysql.escape(str);
  return str;
}

// #region match
// Returns the match of the exact given id.
function getMatch(matchId) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM matches WHERE id = ?", [escapeString(matchId)], (err, matches) => {
      if (err) {
        reject(err);
      } else {
        if (matches.length == 0) {
          reject("No such match exists");
        }
        
        let match = matches[0];
        resolve(match);
      }
    });
  });
}

// Removes a given team from a given match. This is done by setting the teamId-property containing the given team to null.
async function unsetContestant(matchId, teamId) {
  let match = await getMatch(matchId);
  if (match.team1Id == teamId) {
    connection.query("UPDATE matches SET team1Id = NULL WHERE id = ?", [escapeString(matchId)], (err, result) => {
      if (err) { console.log(err); }
    });
  } else if (match.team2Id == teamId) {
    connection.query("UPDATE matches SET team2Id = NULL WHERE id = ?", [escapeString(matchId)], (err, result) => {
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

        // Final match doesn't have a parent, skip this step
        if (match.parentMatchId != null) {
          if (match.winnerId != null) {
            unsetContestant(match.parentMatchId, match.winnerId);
          }
          // Enter the winner of the match into the parent match
          getMatch(match.parentMatchId)
            .catch(err =>reject(err))
            .then(parentMatch => {
              if (parentMatch.team1Id == null) {
                connection.query("UPDATE matches SET team1Id = ? WHERE id = ?", 
                [escapeString(winnerId), escapeString(parentMatch.id)], (err, sets) => {
                  if (err) { reject(err); }
                });
              } else if (parentMatch.team2Id == null) {
                connection.query("UPDATE matches SET team2Id = ? WHERE id = ?", 
                [escapeString(winnerId), escapeString(parentMatch.id)], (err, sets) => {
                  if (err) { reject(err); }
                });
              } else {
                reject("Parent match already has two teams");
              }
          });
        }

        // Lastly, if all checks passed, actually set the winnerId property
        connection.query("UPDATE matches SET winnerId = ? WHERE id = ?", 
        [escapeString(winnerId), escapeString(matchId)], (err, sets) => {
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
// #endregion

// #region tournament

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

function getTournament(tournamentId) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM tournaments WHERE id = ?", [escapeString(tournamentId)], (err, tournaments) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (tournaments.length == 0) {
          reject("No such tournament exists");
        }
        //TODO number of competing teams

        let tournament = tournaments[0];
        resolve(tournament);
      }
    });
  });
}

function getMatchesByTournamentId(tournamentId) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM matches WHERE tournamentId = ?", [escapeString(tournamentId)], (err, matches) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });
}

function createTournament(name, description, startDate, endDate, teamLimit) {
  startDate = startDate.toISOString().slice(0, 19).replace('T', ' ');
  endDate = endDate.toISOString().slice(0, 19).replace('T', ' ');
  return new Promise(function(resolve, reject) {
    connection.query("INSERT INTO tournaments (name, description, startTime, endTime, teamLimit) VALUES (?, ?, ?, ?, ?)", 
    [escapeString(name), escapeString(description), startDate, endDate, teamLimit], (err, sets) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {

        // Create the matches for the tournament
        let tournamentId = sets.insertId;
        let tiers = Math.log2(teamLimit);
        for (let tier = 0; tier < tiers; tier++) {
          let matchCount = Math.pow(2, tier);
          for (let matchId = 0; matchId < matchCount; matchId++) {
            let parentMatchId = null;
            if (tier > 0) {
              parentMatchId = Math.pow(2, tier - 1) + Math.floor((matchId - (matchId % 2)) / 2);
            }
            connection.query("INSERT INTO matches (tournamentId, parentMatchId, tier) VALUES (?, ?, ?)", 
            [tournamentId, parentMatchId, tier], (err, sets) => {
              if (err) {
                console.error("Could not create match:");
                console.log(err);
              }
            });
          }
        }
        resolve("Tournament created");
      }
    });
  });
}

function editTournament(tournamentId, name, description, startDate, endDate) {
  startDate = startDate.toISOString().slice(0, 19).replace('T', ' ');
  endDate = endDate.toISOString().slice(0, 19).replace('T', ' ');
  return new Promise(function(resolve, reject) {
    connection.query("UPDATE tournaments SET name = ?, description = ?, startTime = ?, endTime = ? WHERE id = ?",
    [escapeString(name), escapeString(description), startDate, endDate, escapeString(tournamentId)], (err, sets) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve("Tournament updated");
      }
    });
  });
}

function getTeamsByTournamentId(tournamentId) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM teams WHERE tournamentId = ?", [escapeString(tournamentId)], (err, teams) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(teams);
      }
    });
  });
}
// #endregion

// #region team

function getTeam(teamId) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM teams WHERE id = ?", [escapeString(teamId)], (err, teams) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (teams.length == 0) {
          reject("No such team exists");
        }
        resolve(teams[0]);
      }
    });
  });
}

function editTeam(teamId, name) {
  return new Promise(function(resolve, reject) {
    connection.query("UPDATE teams SET name = ? WHERE id = ?", [escapeString(name), escapeString(teamId)], (err, sets) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve("Team updated");
      }
    });
  });
}

// #endregion

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