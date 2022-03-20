// TMDB - Tournament Manager DataBase
// Handles all the database operations for the Tournament Manager
// Exports the following functions:
module.exports = {
  getMatchesByTournamentId: getMatchesByTournamentId,
  getTournaments: getTournaments,
  executeStatement: executeStatement
}

const mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

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