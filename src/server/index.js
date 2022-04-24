const path = require("path");
const express = require("express");
const session = require('express-session');
const https = require("https");
require("dotenv").config();

// Our self-written module for handling database operations
let tmdb = require("./tmdb.js");

// #region Express setup
const app = express();
const port = 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  rolling: true,
  cookie: { 
    secure: (process.env.COOKIE_SECURE == "true"), // All env vars are strings, so cast bool manually
    sameSite: 'strict', // Browsers will reject a "secure" cookie without this
    maxAge: 60 * 60 * 1000 // 1 hour (in milliseconds)
  }
}));
let api = express.Router();
app.use("/api", api);

api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
api.use(require('express-log-url'));
app.use(require('express-log-url'));

// #endregion

// #region frontend

// Serve static files from the React app
app.use('/', express.static(path.join(__dirname, 'clientbuild')));
app.use('/login', express.static(path.join(__dirname, 'clientbuild', 'index.html')));
app.use('/history', express.static(path.join(__dirname, 'clientbuild', 'index.html')));
app.use('/admins', express.static(path.join(__dirname, 'clientbuild', 'index.html')));
app.use('/profile', express.static(path.join(__dirname, 'clientbuild', 'index.html')));
app.use('/tournament/*', express.static(path.join(__dirname, 'clientbuild', 'index.html')));
app.use('/static', express.static(path.join(__dirname, 'clientbuild/static')));
app.use('/static/*', express.static(path.join(__dirname, 'clientbuild/static')));
// #endregion

// #region PASSPORT / OAUTH

const passport = require('passport');
const { getUserByEmail } = require("./tmdb.js");
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email']})
);
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  async function(req, res) {
    // Get user profile from passport
    // This is retrieved from the callback url data ?code=...
    let user = {
      googleId: req.user.id,
      name: req.user.displayName,
      email: req.user.emails[0].value,
      imgurl: req.user.photos[0].value,
      asuraId: null,
    }

    // Check if user exists in database
    tmdb.getUserByEmail(user.email)
    .then(dbUser => {
      user.asuraId = dbUser.id; // asuraId is the database id / primary key
      if (dbUser.googleId) {
        // User is already registered with google, simply log them in
        req.session.user = dbUser;
      } else {
        // User is "preregistered" with email only, so complete the registration
        // This step will register the name, img and googleId
        tmdb.editUser(user.email, user).catch(err => console.log(err));

        req.session.user = user;
      }

      res.redirect(process.env.AUTH_SUCCESS_REDIRECT);
      return;
    })
    .catch(err => {
      // User is not in the database at all, do not give them a session.
      res.json({"status": "error", message: "Email is not in administrator list."});
      return;
    });
  }
);

// #endregion


// #region API
api.get("/tournament/getTournaments", (req, res) => {
  tmdb.getTournaments()
    .then(tournaments => res.json({"status": "OK", "data": tournaments}))
    .catch(err => res.json({"status": "error", "data": err}));
});

// #region tournament/:tournamentId
api.get("/tournament/:tournamentId", (req, res) => {
  let tournamentId = req.params.tournamentId;
  if (isNaN(tournamentId)) {
    res.json({"status": "error", "data": "Invalid tournament id"});
    return;
  }
  tmdb.getTournament(parseInt(tournamentId))
    .then(tournament => res.json({"status": "OK", "data": tournament}))
    .catch(err => res.json({"status": "error", "data": err}));
    
});

api.get("/tournament/:tournamentId/getMatches", (req, res) => {
  let tournamentId = req.params.tournamentId;
  if (isNaN(tournamentId)) {
    res.json({"status": "error", "data": "tournamentId must be a number"});
    return
  }
  tournamentId = parseInt(tournamentId);
  tmdb.getMatchesByTournamentId(tournamentId)
  .then(matches => res.send({"status": "OK", "data": matches}))
  .catch(err => res.send({"status": "error", "data": err}));
});

api.get("/tournament/:tournamentId/getTeams", (req, res) => {
  let tournamentId = req.params.tournamentId;
  if (!tournamentId || isNaN(tournamentId)) {
    res.json({"status": "error", "data": "tournamentId must be a number"});
    return
  }
  tournamentId = parseInt(tournamentId);
  tmdb.getTeamsByTournamentId(tournamentId)
    .then(teams => res.send({"status": "OK", "data": teams}))
    .catch(err => res.send({"status": "error", "data": err}));
});

api.post("/tournament/:tournamentId/edit", (req, res) => {
  let tournamentId = req.params.tournamentId;
  if (isNaN(tournamentId)) {
    res.json({"status": "error", "data": "tournamentId must be a number"});
    return
  }
  tournamentId = parseInt(tournamentId);
  let name = req.body.name;
  let description = req.body.description;
  let prize = req.body.prize;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  console.log(startDate);
  if (name == undefined || name == "" || description == undefined || description == "") {
    res.json({"status": "error", "data": "name and description must be provided"});
    return
  }
  if (startDate == undefined || endDate == undefined) {
    res.json({"status": "error", "data": "startDate and endDate must be defined"});
    return
  }
  try {
    startDate = new Date(parseInt(startDate));
    endDate = new Date(parseInt(endDate));
  } catch (err) {
    res.json({"status": "error", "data": "startDate and endDate must be valid dates"});
    return
  }
  // let today = new Date();
  // if (startDate < today) {
  //   res.json({"status": "error", "data": "startDate cannot be in the past"});
  //   return
  // }
  if (startDate > endDate) {
    res.json({"status": "error", "data": "startDate cannot be after endDate"});
    return
  }

  tmdb.editTournament(tournamentId, name, description, prize, startDate, endDate)
    .then(msg => res.json({"status": "OK", "data": msg}))
    .catch(err => res.json({"status": "error", "data": err}));
    
});

api.post("/tournament/:tournamentId/createTeam", (req, res) => {
  let tournamentId = req.params.tournamentId;
  if (isNaN(tournamentId)) {
    res.json({"status": "error", "data": "tournamentId must be a number"});
    return;
  }
  tournamentId = parseInt(tournamentId);
  let teamName = req.body.name;
  if (teamName == undefined || teamName == "") {
    res.json({"status": "error", "data": "teamName must be a non-empty string"});
    return;
  }
  
  tmdb.createTeam(tournamentId, teamName)
    .then(msg => res.json({"status": "OK", "data": msg}))
    .catch(err => res.json({"status": "error", "data": err}));
});

api.delete("/tournament/:tournamentId", (req, res) => {
  let tournamentId = req.params.tournamentId;
  if (isNaN(tournamentId)) {
    res.json({"status": "error", "data": "tournamentId must be a number"});
    return;
  }
  tournamentId = parseInt(tournamentId);
  tmdb.deleteTournament(tournamentId)
    .then(msg => res.json({"status": "OK", "data": msg}))
    .catch(err => res.json({"status": "error", "data": err}));
});

// #endregion

// #region match/:matchId


api.get("/match/:matchId", (req, res) => {
  let matchId = req.params.matchId;
  if (isNaN(matchId)) {
    res.json({"status": "error", "data": "matchId must be a number"});
    return
  }
  matchId = parseInt(matchId);
  tmdb.getMatch(matchId)
  .then(match => res.send({"status": "OK", "data": match}))
  .catch(err => res.send({"status": "error", "data": err}));
});

api.post("/match/:matchId/setWinner", (req, res) => {
  let matchId = req.params.matchId;
  let winnerId = req.body.winnerId;
  if (isNaN(matchId)) {
    res.json({"status": "error", "data": "matchId must be a number"});
    return
  }
  if (winnerId == undefined || isNaN(winnerId)) {
    res.json({"status": "error", "data": "winnerId must be a number"});
    return
  }
  
  matchId = parseInt(matchId);
  winnerId = parseInt(winnerId);
  tmdb.setMatchWinner(matchId, winnerId)
  .then(match => res.send({"status": "OK", "data": match}))
  .catch(err => res.send({"status": "error", "data": err}));
});

api.post("/match/:matchId/unsetContestant", (req, res) => {
  let matchId = req.params.matchId;
  let contestantId = req.body.teamId;
  if (isNaN(matchId)) {
    res.json({"status": "error", "data": "matchId must be a number"});
    return
  }
  if (contestantId == undefined || isNaN(contestantId)) {
    res.json({"status": "error", "data": "contestantId must be a number"});
    return
  }
  
  matchId = parseInt(matchId);
  contestantId = parseInt(contestantId);
  tmdb.unsetContestantAndWinner(matchId, contestantId)
    .then(match => res.send({"status": "OK", "data": match}))
    .catch(err => res.send({"status": "error", "data": err}));
});
// #endregion

// #region team/:teamId
api.get("/team/:teamId", (req, res) => {
  let teamId = req.params.teamId;
  if (isNaN(teamId)) {
    res.json({"status": "error", "data": "teamId must be a number"});
    return
  }
  teamId = parseInt(teamId);
  tmdb.getTeam(teamId)
  .then(match => res.send({"status": "OK", "data": match}))
  .catch(err => res.send({"status": "error", "data": err}));
});

api.delete("/team/:teamId", (req, res) => {
  let teamId = req.params.teamId;
  if (isNaN(teamId)) {
    res.json({"status": "error", "data": "teamId must be a number"});
    return
  }
  try {
    teamId = parseInt(teamId);
  } catch (err) {
    res.json({"status": "error", "data": "teamId must be a number"});
    return
  }
  tmdb.deleteTeam(teamId)
    .then(match => res.send({"status": "OK", "data": match}))
    .catch(err => res.send({"status": "error", "data": err}));
});

api.post("/team/:teamId/edit", (req, res) => {
  let teamId = req.params.teamId;
  let teamName = req.body.name;
  console.log(req.body);
  if (isNaN(teamId)) {
    res.json({"status": "error", "data": "teamId must be a number"});
    return
  }
  if (teamName == undefined || teamName == "") {
    res.json({"status": "error", "data": "teamName must be a non-empty string"});
    return
  }
  teamId = parseInt(teamId);
  tmdb.editTeam(teamId, teamName)
    .then(match => res.send({"status": "OK", "data": match}))
    .catch(err => res.send({"status": "error", "data": err}));
});
  

// #endregion

//Takes JSON body
api.post("/tournament/create", async (req, res) => {
  // if (!(await isManager(req.session))) {
  //   res.json({"status": "error", "data": "Not authorized"});
  //   return
  // }
  //Check that req body is valid
  if (req.body.name == undefined || req.body.name == "") {
    res.json({"status": "error", "data": "No data supplied"});
    return
  }
  //Check that req is json  
  // if (req.get("Content-Type") != "application/json") {
  console.log(req.get("Content-Type"));
  let name = req.body.name;
  let description = req.body.description;
  let prize = req.body.prize;
  let teamLimit = req.body.teamLimit;
  let startDate = req.body.startDate; //TODO: timezones, 2 hr skips
  let endDate = req.body.endDate;
  console.log(startDate, endDate);
  if (name == undefined || name == "" || description == undefined || description == "") {
    res.json({"status": "error", "data": "name and description must be provided"});
    return
  }
  if (teamLimit == undefined ) {
    res.json({"status": "error", "data": "teamLimit must be provided"});
    return
  }
  try {
    teamLimit = parseInt(teamLimit);
  } catch (err) {
    res.json({"status": "error", "data": "teamLimit must be a number"});
    return
  }
  if (startDate == undefined || endDate == undefined) {
    res.json({"status": "error", "data": "startDate and endDate must be defined"});
    return
  }
  try {
    startDate = new Date(parseInt(startDate));
    endDate = new Date(parseInt(endDate));
  } catch (err) {
    res.json({"status": "error", "data": "startDate and endDate must be valid dates"});
    return
  }
  let today = new Date();
  if (startDate < today) {
    res.json({"status": "error", "data": "startDate cannot be in the past"});
    return
  }
  if (startDate > endDate) {
    res.json({"status": "error", "data": "endDate must be later than startDate"});
    return
  }
  console.log(startDate);

  tmdb.createTournament(name, description, prize, startDate, endDate, teamLimit)
    .then(msg => res.json({"status": "OK", "data": msg}))
    .catch(err => res.json({"status": "error", "data": err}));
});    
  
// #endregion

// #region users

function isLoggedIn(session) {
  return new Promise((resolve, reject) => {
    if (session.user == undefined || session.user.googleId == undefined) {
      return resolve(false);
    }
    let googleId = session.user.googleId;
  
    tmdb.getUserByGoogleId(googleId)
      .then(user => {return resolve(user != undefined) })
      .catch(err => {resolve(false) });
  });
}


function isManager(session) {
  return new Promise((resolve, reject) => {
    if (session.user == undefined || session.user.googleId == undefined) {
      return resolve(false);
    }
    let googleId = session.user.googleId;
    tmdb.getUserByGoogleId(googleId)
      .then(user => {return resolve(user.isManager) })
      .catch(err => {resolve(false) });
  });
}

api.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

api.get("/users/getSessionUser", (req, res) => {
  if (req.session.user) {
    res.json({"status": "OK", "data": req.session.user});
  } else {
    res.json({"status": "error", "data": "No user logged in"});
  }
});

api.get("/users/getSavedUser", (req, res) => {
  if (!req.session.user) {
    res.json({"status": "error", "data": "No user logged in"});
    return
  }
  let googleId = req.session.user.googleId;
  tmdb.getUserByGoogleId(googleId)
    .then(user => res.json({"status": "OK", "data": user}))
    .catch(err => res.json({"status": "error", "data": err}));
});

api.get("/users/getUsers", (req, res) => {
  tmdb.getUsers()
  .then(users => res.json({"status": "OK", "data": users}))
  .catch(err => res.json({"status": "error", "data": err}));
});

api.post("/users/createBlank", async (req, res) => {
  if (!(await isManager(req.session))) {
    res.json({"status": "error", "data": "Not authorized"});
    return
  }
  let email = req.body.email;
  // Check if the user already exists
  tmdb.getUserByEmail(email)
    .then(user => {
      res.json({"status": "error", "data": "User already exists", user: user});
    })
    .catch(err => {
      console.log(err);
      if (err == "No such user exists") {
        // Create a new user
        tmdb.createUserBlank(email)
          .then(user => {
            res.json({"status": "OK", "data": user});
          })
          .catch(err => {
            res.json({"status": "error", "data": err});
          });
      } else {
        res.json({"status": "error", "data": err});
      }
    });
});

api.post("/users/changeManagerStatus", async (req, res) => {
  if (!await isManager(req.session)) {
    res.json({"status": "error", "data": "Not authorized"});
    return
  }
  let emailAddress = req.body.emailAddress;
  let isManager = req.body.isManager;


  tmdb.getUserByEmail(emailAddress)
    .then(user => {
      tmdb.changeManagerStatus(user.id, isManager)
        .then(msg => res.json({"status": "OK", "data": msg}))
        .catch(err => res.json({"status": "error", "data": err}));
    })
    .catch(err => {
      console.log(err);
      res.json({"status": "error", "data": "Could not update the specified user"});
    });
});


api.get("/dumpsession", async (req, res) => {
  let out = {};
  out.session = req.session;
  out.header = req.headers;
  out.isLoggedIn = await isLoggedIn(req.session);
  out.isManager = await isManager(req.session);
  console.log(out);
  res.json(out);
});
// #endregion
