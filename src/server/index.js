const path = require("path");
const express = require("express");
const app = express();
const port = 3000;

const Match = require("./match.js");

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.get("/match", (req, res) => {
  let match = new Match(1, [1, 2]);
  res.send(JSON.stringify(match));
});
