-- WARNING: Will delete EVERYTHING in the database!

DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS tournaments;
DROP TABLE IF EXISTS users;

-- Create the tables
CREATE TABLE tournaments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    prize TEXT,
    teamLimit INTEGER NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL
);

CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    tournamentId INTEGER NOT NULL,
    name TEXT NOT NULL,

    FOREIGN KEY (tournamentId) REFERENCES tournaments (id) ON DELETE CASCADE
);

CREATE TABLE matches (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    tournamentId INTEGER NOT NULL,
    parentMatchId INTEGER,
    team1Id INTEGER,
    team2Id INTEGER,
    winnerId INTEGER,
    tier INTEGER,

    FOREIGN KEY (tournamentId) REFERENCES tournaments (id) ON DELETE CASCADE,
    FOREIGN KEY (team1Id) REFERENCES teams (id) ON DELETE SET NULL,
    FOREIGN KEY (team2Id) REFERENCES teams (id) ON DELETE SET NULL,
    FOREIGN KEY (winnerId) REFERENCES teams (id) ON DELETE SET NULL
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    googleId TEXT,
    name TEXT,
    email TEXT NOT NULL,
    isManager BOOLEAN NOT NULL
);

-- Example data (Two tournaments, 4 teams, single elimination)
INSERT INTO tournaments (name, description, prize, startTime, endTime, teamLimit) VALUES ('Tournament 1', 'First tournament, single elimination', '300 000 points', '2022-04-29 16:00:00', '2022-04-29 20:00:00', 4);
INSERT INTO tournaments (name, description, prize, startTime, endTime, teamLimit) VALUES ('Tournament 2', 'Second tournament, four teams', '450 000 points', '2022-04-29 09:00:00', '2022-04-29 10:30:00', 8);
INSERT INTO tournaments (name, description, prize, startTime, endTime, teamLimit) VALUES ('Tournament 3', 'Previous tournament, it is done', '200 000 points', '2022-04-24 12:00:00', '2022-04-25 12:00:00', 4);

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

INSERT INTO teams(tournamentId, name) VALUES (3, 'Fnatic');         -- 13
INSERT INTO teams(tournamentId, name) VALUES (3, 'Cloud 9');        -- 14
INSERT INTO teams(tournamentId, name) VALUES (3, 'Team Liquid');    -- 15
INSERT INTO teams(tournamentId, name) VALUES (3, 'LDLC');           -- 16


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

-- tournament 3 --
-- Final match
INSERT INTO matches (tournamentId, parentMatchId, team1Id, team2Id, tier, winnerId) VALUES (3, NULL, 14, 15, 0, 14);   -- 11
-- Semi-finals
INSERT INTO matches (tournamentId, parentMatchId, team1Id, team2Id, tier, winnerId) VALUES (3, 11, 13, 14, 1, 14);            -- 12
INSERT INTO matches (tournamentId, parentMatchId, team1Id, team2Id, tier, winnerId) VALUES (3, 11, 15, 16, 1, 15);            -- 13

-- Users
INSERT INTO users (email, isManager) VALUES ('felixalbrigtsen@gmail.com', 1);
INSERT INTO users (email, isManager) VALUES ('kriloneri@gmail.com', 1);
INSERT INTO users (email, isManager) VALUES ('limboblivion@gmail.com', 1);
INSERT INTO users (email, isManager) VALUES ('jonas.haugland98@gmail.com', 1);