class Match {
  tournamentId = null;
  teamIds = [];
  scores = {};
  winner = null;

  constructor(tournamentId, teamIds) {
    this.tournamentId = tournamentId;
    this.teamIds = teamIds;
    //this.scores = Array(teamIds.length).fill(0);
    for (let teamId of teamIds) {
      this.scores[teamId] = 0;
    }
  }

  setScore = function(teamId, score) {
    scores[teamId] = score;
  };

  getScore = function(teamId) {
    return scores[teamId];
  };

  setWinner = function(teamId) {
    this.winner = teamId;
  };
}

module.exports = Match;
