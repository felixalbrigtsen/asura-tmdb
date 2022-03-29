// TMDB - Tournament Manager DataBase
// Handles all the database operations for the Tournament Manager
// Exports the following functions:
module.exports = {
  getMatchesByTournamentId: getMatchesByTournamentId,
  getTournaments: getTournaments,
  getTournament, getTournament,
  getTeam: getTeam,
  createTeam: createTeam,
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
    // 1. Get the list of tournament IDs
    // 2. getTournament() for each ID
    // 3. Return list of tournaments
    let tournamentList = [];
    connection.query("SELECT id FROM tournaments", async (err, tournamentIds) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        let tournaments = await Promise.all(tournamentIds.map(async function(tournament){
          return await getTournament(tournament.id);
        }));
        resolve(tournaments);
      }
    });

  });
}

function getTournament(tournamentId) {
  // 1. Get the tournament
  // 2. Get all teams associated with the tournament
  // 3. Associate the teams with the tournament
  // 4. Return the tournament
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM tournaments WHERE id = ?", [escapeString(tournamentId)], (err, tournaments) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (tournaments.length == 0) {
          reject("No such tournament exists");
        }
        
        getTeamsByTournamentId(tournamentId)
          .catch(err => reject(err))
          .then(teams => {
            let tournament = tournaments[0];
            //TODO: CHeckh this
//             /home/felixalb/Documents/NTNU/semester2/sysut_server/src/server/tmdb.js:163
//             tournament.teamCount = teams.length;
//                                  ^

// TypeError: Cannot set properties of undefined (setting 'teamCount')
//     at /home/felixalb/Documents/NTNU/semester2/sysut_server/src/server/tmdb.js:163:34

            tournament.teamCount = teams.length;
            resolve(tournament);
          });
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

function createMatch(tournamentId, parentMatchId, tier) {
  //Returns Promise<int> witht the inserted ID.
  return new Promise(function(resolve, reject) {
    connection.query("INSERT INTO matches (tournamentId, parentMatchId, tier) VALUES (?, ?, ?)",
    [escapeString(tournamentId), escapeString(parentMatchId), escapeString(tier)], (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
}

function createTournament(name, description, startDate, endDate, teamLimit) {
  startDate = startDate.toISOString().slice(0, 19).replace('T', ' ');
  endDate = endDate.toISOString().slice(0, 19).replace('T', ' ');
  return new Promise(function(resolve, reject) {
    connection.query("INSERT INTO tournaments (name, description, startTime, endTime, teamLimit) VALUES (?, ?, ?, ?, ?)", 
    [escapeString(name), escapeString(description), startDate, endDate, teamLimit], async (err, sets) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        // Create the matches for the tournament
        let matchIds = [];
        let tournamentId = sets.insertId;
        let tiers = Math.log2(teamLimit);

        for (let tier = 0; tier < tiers; tier++) {
          let matchCount = Math.pow(2, tier);
          for (let i = 0; i < matchCount; i++) {
            let parentMatchId = null;
            if (tier > 0) {
              let parentMatchIndex = Math.pow(2, tier - 1) + Math.floor((i - (i % 2)) / 2) - 1;
              parentMatchId = matchIds[parentMatchIndex];
            }
            let newMatchId = await createMatch(tournamentId, parentMatchId, tier);
            matchIds.push(newMatchId);
          }
        }
        resolve({message: "Tournament created", tournamentId: sets.insertId});
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

async function editTeam(teamId, name) {
  let team = await getTeam(teamId);
  if (!team) {
    return Promise.reject("No such team exists");
  }
  if (team.name == name) {
    return {message: "Team name unchanged"};
  }
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

async function createTeam(tournamentId, name) {
  //Check that the tournament exists
  let tournament = await getTournament(tournamentId);

  return new Promise(function(resolve, reject) {
    if (!tournament) {
      reject("No such tournament exists");
      return;
    }
    if (tournament.teamLimit <= tournament.teamCount) {
      reject("Tournament is full");
      return;
    }

    connection.query("INSERT INTO teams (tournamentId, name) VALUES (?, ?)", [escapeString(tournamentId), escapeString(name)], async (err, sets) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        await assignFirstMatch(sets.insertId, tournamentId);
        resolve({message: "Team created", teamId: sets.insertId});
      }
    });
  });
}

function deleteTeam(teamId) {
  return new Promise(async function(resolve, reject) {
    connection.query("DELETE FROM teams WHERE id = ?", [escapeString(teamId)], (err, sets) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {

        resolve("Team deleted");
      }
    });
  });
}

//Private function, assigns a starting match to the given team
async function assignFirstMatch(teamId, tournamentId) {
  let tournament = await getTournament(tournamentId);
  let matches = await getMatchesByTournamentId(tournamentId);
  
  let highTier = Math.log2(tournament.teamLimit)-1;
  console.log(highTier);
  let highTierMatches = matches.filter(match => match.tier == highTier);
  console.log(matches);

  return new Promise(function(resolve, reject) {
    for (let match of highTierMatches) {
      if (match.team1Id == null) {
        console.log("Assigning team " + teamId + " to match " + match.id + " as team 1");
        connection.query("UPDATE matches SET team1Id = ? WHERE id = ?", [escapeString(teamId), escapeString(match.id)], (err, sets) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve("Team assigned to match " + match.id);
          }
        });
        return
      } else if (match.team2Id == null) {
        console.log("Assigning team " + teamId + " to match " + match.id + " as team 2");
        connection.query("UPDATE matches SET team2Id = ? WHERE id = ?", [escapeString(teamId), escapeString(match.id)], (err, sets) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve("Team assigned to match " + match.id);
          }
        });
        return
      }
    }
    reject("Could not assign team to any matches");
  });
}

// #endregion
