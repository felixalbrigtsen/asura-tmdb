-- WARNING: Will delete EVERYTHING in the database!

DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS tournaments;

-- Create the tables
CREATE TABLE tournaments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    teamLimit INTEGER NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL
);

CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    tournamentId INTEGER NOT NULL,
    name TEXT NOT NULL,

    FOREIGN KEY (tournamentId) REFERENCES tournaments (id)
);

CREATE TABLE matches (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    tournamentId INTEGER NOT NULL,
    parentMatchId INTEGER,
    team1Id INTEGER,
    team2Id INTEGER,
    winnerId INTEGER,
    tier INTEGER,

    FOREIGN KEY (tournamentId) REFERENCES tournaments (id),
    FOREIGN KEY (team1Id) REFERENCES teams (id),
    FOREIGN KEY (team2Id) REFERENCES teams (id)
);

CREATE TABLE players (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    teamId INTEGER NOT NULL,

    FOREIGN KEY (teamId) REFERENCES teams (id)
);

-- Example data (Two tournaments, 4 teams, single elimination)
INSERT INTO tournaments (name, description, startTime, endTime, teamLimit) VALUES ('Tournament 1', 'First tournament, single elimination', '2022-04-01 16:00:00', '2022-04-01 20:00:00', 4);
INSERT INTO tournaments (name, description, startTime, endTime, teamLimit) VALUES ('Tournament 2', 'Second tournament, four teams', '2022-04-03 17:30:00', '2022-04-04 21:30:00', 8);

INSERT INTO teams (tournamentId, name) VALUES (1, 'Fnatic');        -- 1
INSERT INTO teams (tournamentId, name) VALUES (1, 'Cloud 9');       -- 2
INSERT INTO teams (tournamentId, name) VALUES (1, 'Team Liquid');   -- 3
INSERT INTO teams (tournamentId, name) VALUES (1, 'LDLC');          -- 4

INSERT INTO teams (tournamentId, name) VALUES (2, 'Astralis');      -- 5
INSERT INTO teams (tournamentId, name) VALUES (2, 'Entropiq');      -- 6
INSERT INTO teams (tournamentId, name) VALUES (2, 'Team Vitality'); -- 7
INSERT INTO teams (tournamentId, name) VALUES (2, 'Godsent');       -- 8
INSERT INTO teams (tournamentId, name) VALUES (2, 'Team Secret');   -- 9
INSERT INTO teams (tournamentId, name) VALUES (2, 'Virtus.pro');    -- 10
INSERT INTO teams (tournamentId, name) VALUES (2, 'Natus Vincere'); -- 11
INSERT INTO teams (tournamentId, name) VALUES (2, 'FaZe');          -- 12

-- tournament 1 --
-- Final match
INSERT INTO matches (tournamentId, parentMatchId, team1Id, team2Id, tier) VALUES (1, NULL, NULL, NULL, 0);   -- 1
-- Semi-finals
INSERT INTO matches (tournamentId, parentMatchId, team1Id, team2Id, tier) VALUES (1, 1, 1, 2, 1);            -- 2
INSERT INTO matches (tournamentId, parentMatchId, team1Id, team2Id, tier) VALUES (1, 1, 3, 4, 1);            -- 3

-- tournament 2 --
-- Final match
INSERT INTO matches (tournamentId, parentMatchId, team1Id, team2Id, tier) VALUES (2, NULL, NULL, NULL, 0);   -- 4
-- Semi-finals
INSERT INTO matches (tournamentId, parentMatchId, team1Id, team2Id, tier) VALUES (2, 4, NULL, NULL, 1);             -- 5
INSERT INTO matches (tournamentId, parentMatchId, team1Id, team2Id, tier) VALUES (2, 4, NULL, NULL, 1);             -- 6
-- Quarter-finals
INSERT INTO matches (tournamentId, parentMatchId, team1Id, team2Id, tier) VALUES (2, 5, 5, 6, 2);            -- 7
INSERT INTO matches (tournamentId, parentMatchId, team1Id, team2Id, tier) VALUES (2, 5, 7, 8, 2);           -- 8
INSERT INTO matches (tournamentId, parentMatchId, team1Id, team2Id, tier) VALUES (2, 6, 9, 10, 2);            -- 9
INSERT INTO matches (tournamentId, parentMatchId, team1Id, team2Id, tier) VALUES (2, 6, 11, 12, 2);           -- 10

-- Players
INSERT INTO players (name, teamId) VALUES ('Player 1', 1);
INSERT INTO players (name, teamId) VALUES ('Player 2', 1);
INSERT INTO players (name, teamId) VALUES ('Player 3', 2);
INSERT INTO players (name, teamId) VALUES ('Player 4', 2);
INSERT INTO players (name, teamId) VALUES ('Player 5', 3);
INSERT INTO players (name, teamId) VALUES ('Player 6', 3);
INSERT INTO players (name, teamId) VALUES ('Player 7', 4);
INSERT INTO players (name, teamId) VALUES ('Player 8', 4);
INSERT INTO players (name, teamId) VALUES ('Player 9', 5);
INSERT INTO players (name, teamId) VALUES ('Player 10', 5);
INSERT INTO players (name, teamId) VALUES ('Player 11', 6);
INSERT INTO players (name, teamId) VALUES ('Player 12', 6);
INSERT INTO players (name, teamId) VALUES ('Player 13', 7);
INSERT INTO players (name, teamId) VALUES ('Player 14', 7);
INSERT INTO players (name, teamId) VALUES ('Player 15', 8);
INSERT INTO players (name, teamId) VALUES ('Player 16', 8);
INSERT INTO players (name, teamId) VALUES ('Player 17', 9);
INSERT INTO players (name, teamId) VALUES ('Player 18', 9);
INSERT INTO players (name, teamId) VALUES ('Player 19', 10);
INSERT INTO players (name, teamId) VALUES ('Player 20', 10);
INSERT INTO players (name, teamId) VALUES ('Player 21', 11);
INSERT INTO players (name, teamId) VALUES ('Player 22', 11);
INSERT INTO players (name, teamId) VALUES ('Player 23', 12);
INSERT INTO players (name, teamId) VALUES ('Player 24', 12);
