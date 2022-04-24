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
  deleteTeam: deleteTeam,
  getMatch: getMatch,
  setMatchWinner: setMatchWinner,
  unsetContestantAndWinner: unsetContestantAndWinner,
  createTournament: createTournament,
  deleteTournament: deleteTournament,
  editTournament: editTournament,
  getTeamsByTournamentId: getTeamsByTournamentId,
  getUsers: getUsers,
  getUserByEmail: getUserByEmail,
  getUserByGoogleId: getUserByGoogleId,
  createUserBlank: createUserBlank,
  editUser: editUser,
}

const mysql = require("mysql");

// #region Database setup

let db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};
let connection
// https://stackoverflow.com/a/20211143
function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection
  
  connection.connect(function(err) {
    if(err) {                                    
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}


handleDisconnect(); //Start the auto-restarting connection

function escapeString(str) {
  // return mysql.escape(str);
  return str;
}

// #endregion

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
  return new Promise(function(resolve, reject) {
    
    if (match.team1Id == teamId) {
      connection.query("UPDATE matches SET team1Id = NULL WHERE id = ?", [escapeString(matchId)], (err, result) => {
        if (err) { console.log(err); reject(err); }
        resolve();
      });
    } else if (match.team2Id == teamId) {
      connection.query("UPDATE matches SET team2Id = NULL WHERE id = ?", [escapeString(matchId)], (err, result) => {
        if (err) { console.log(err); reject(err); }
        resolve();
      });
    } else {
      console.log("Error: Team not found in match");
      reject("Error: Team not found in match");
    }
  });
}


async function insertContestant(matchId, teamId, prevMatchId) {
  let match = await getMatch(matchId);
  connection.query("SELECT * FROM matches WHERE parentMatchId = ?", [escapeString(matchId)], (err, childMatches) => {
    if (err) { console.log(err); }
    let isFirst = prevMatchId == childMatches[0].id;
    if (isFirst) {
      if (match.team1Id != null) { return; }
      connection.query("UPDATE matches SET team1Id = ? WHERE id = ?", 
      [escapeString(teamId), escapeString(matchId)], (err, sets) => {
        if (err) { console.log(err); }
      });
    } else {
      if (match.team2Id != null) { return; }
      connection.query("UPDATE matches SET team2Id = ? WHERE id = ?", 
      [escapeString(teamId), escapeString(matchId)], (err, sets) => {
        if (err) { console.log(err); }
      });
    }
  });
}

async function setMatchWinner(matchId, winnerId) {
  return new Promise(async function(resolve, reject) {
    let match = await getMatch(matchId);
    if (winnerId != match.team1Id && winnerId != match.team2Id && winnerId != null) {
      reject("Winner id must be one of the teams in the match, or null");
      return;
    }
    let oldWinnerId = match.winnerId;
    connection.query("UPDATE matches SET winnerId = ? WHERE id = ?",[escapeString(winnerId), escapeString(matchId)], async (err, sets) => {
      if (err) {
        reject(err);
        return;
      }

      // Remove the old winner from the next match
      if (oldWinnerId != null && match.parentMatchId != null) {
        let parentMatch = await getMatch(match.parentMatchId);
        // Do not undo the match if the parent match is played and finished
        if (parentMatch.winnerId != null) {
          connection.query("UPDATE matches SET winnerId = ? WHERE id = ?", [escapeString(oldWinnerId), escapeString(match.parentMatchId)], (err, sets) => {});
          reject("The next match is already played");
          return;
        }
        await unsetContestant(match.parentMatchId, oldWinnerId);
      }
      if (match.parentMatchId != null && winnerId != null) {
        insertContestant(match.parentMatchId, winnerId, matchId);
      }

      resolve(getMatch(matchId));
    });
  });
}

async function unsetContestantAndWinner(matchId, teamId) {
  let match = await getMatch(matchId);
  return new Promise(function(resolve, reject) {
      // Find what the child match that supplied the team
      connection.query("SELECT * FROM matches WHERE parentMatchId = ? AND winnerId = ?", [matchId, teamId], (err, childMatches) => {
        if (err) { console.log(err); reject(err); }
        if (childMatches.length != 1) {
          reject("Error: Could not find the correct child match");
          return;
        }
        let childMatch = childMatches[0];
        // Remove the winner from the child match
        setMatchWinner(childMatch.id, null)
          .then(() => { resolve(); })
          .catch(err => { reject(err); });
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
        return
      }
        
      getTeamsByTournamentId(tournamentId)
        .catch(err => reject(err))
        .then(teams => {
          let tournament = tournaments[0];
          tournament.teamCount = teams.length;
          resolve(tournament);
        });
      }
    });
  });
}

function deleteTournament(tournamentId) {
  return new Promise(function(resolve, reject) {
    connection.query("DELETE FROM tournaments WHERE id = ?", [escapeString(tournamentId)], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
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

function createTournament(name, description, prize, startDate, endDate, teamLimit) {
  startDate = startDate.toISOString().slice(0, 19).replace('T', ' ');
  endDate = endDate.toISOString().slice(0, 19).replace('T', ' ');
  return new Promise(function(resolve, reject) {
    connection.query("INSERT INTO tournaments (name, description, prize, startTime, endTime, teamLimit) VALUES (?, ?, ?, ?, ?, ?)", 
    [escapeString(name), escapeString(description), escapeString(prize), startDate, endDate, teamLimit], async (err, sets) => {
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

function editTournament(tournamentId, name, description, prize, startDate, endDate) {
  startDate = startDate.toISOString().slice(0, 19).replace('T', ' ');
  endDate = endDate.toISOString().slice(0, 19).replace('T', ' ');
  return new Promise(function(resolve, reject) {
    connection.query("UPDATE tournaments SET name = ?, description = ?, prize = ?, startTime = ?, endTime = ? WHERE id = ?",
    [escapeString(name), escapeString(description), escapeString(prize), startDate, endDate, escapeString(tournamentId)], (err, sets) => {
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
  let highTierMatches = matches.filter(match => match.tier == highTier);

  return new Promise(function(resolve, reject) {
    for (let match of highTierMatches) {
      if (match.team1Id == null) {
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


// #region users

function getUsers () {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM users", (err, userRows) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        let users = [];
        userRows.forEach((userRow, index) => {
          let user = results=JSON.parse(JSON.stringify(userRow))
          user.isManager = user.isManager == 1;
          user.asuraId = user.id;
          user.id = undefined;
          users.push(user);
        });
        resolve(users);
      }
    });
  });
}

function getUserByGoogleId(googleId) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM users WHERE googleId = ?", [escapeString(googleId)], (err, users) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (users.length == 0) {
          reject("No such user exists");
        }
        users[0].isManager = users[0].isManager == 1;
        users[0].asuraId = users[0].id;
        users[0].id = undefined;
        resolve(users[0]);
      }
    });
  });
}

function getUserByEmail(email) {
  return new Promise(function(resolve, reject) {
    connection.query("SELECT * FROM users WHERE email = ?", [escapeString(email)], (err, users) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (users.length == 0) {
          reject("No such user exists");
          return;
        }
        users[0].isManager = users[0].isManager == 1;
        users[0].asuraId = users[0].id;
        users[0].id = undefined;
        resolve(users[0]);
      }
    });
  });
}

function createUserBlank(email) {
  return new Promise(function(resolve, reject) {
    //Check that the user doesn't already exist
    getUserByEmail(email).then(user => {
      reject("No such user exists");
    }).catch(err => {
      if (err != "No such user exists") {
        console.log(err);
        reject(err);
        return;
      }
      // Create a user, with only an email address
      connection.query("INSERT INTO users (email, isManager) VALUES (?, FALSE)", [escapeString(email)], (err, sets) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve({message: "User Created", userId: sets.insertId});
        }
      });
    });
  });
}

function editUser(email, user) {
  return new Promise(function(resolve, reject) {
    if (!user.isManager) { // If isManager is not defined (or false)
      user.isManager = false;
    }
    connection.query("UPDATE users SET googleId = ?, name = ?, isManager = ? WHERE email = ?", [escapeString(user.googleId), escapeString(user.name), escapeString(user.isManager), escapeString(email)], (err, sets) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(sets);
        resolve("User updated");
      }
    });
  });
}

function userIsManager(userId) {
  getUser(userId)
    .then(user => { return user.isManager; })
    .catch(err => { console.log(err); return false; });
}

// #endregion