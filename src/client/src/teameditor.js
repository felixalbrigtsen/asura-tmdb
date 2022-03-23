import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Appbar from "./components/appbar";
import {
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  Container,
  Slider,
} from "@mui/material";

function TeamChanger() {
  return (
    <>
      <form>
        <InputLabel htmlFor="teamInput">Team Name: </InputLabel>
        <TextField
          type="text"
          id="teamInput"
          variant="filled"
          label="Team Name:"
        />
        <InputLabel htmlFor="membersInput">Team Members: </InputLabel>
        <TextField
          type="text"
          id="membersInput"
          variant="filled"
          label="Members:"
        />
      </form>
    </>
  );
}

function TeamList() {
  let teams = {
    "team 1": ["tom", "eric", "gustav"],
    "team 2": ["emma", "mari", "ida"],
    "team 3": ["ola", "ole", "ost"],
    "team 4": ["christine", "kristine", "kristhine"],
  };
  const [teamInput, setteamInput] = React.useState("");
  const [membersInput, setmembersInput] = React.useState("");
  React.useEffect(() => {
    document.getElementById("teamInput").value = teamInput;
    document.getElementById("membersInput").value = membersInput;
  });
  return (
    <div>
      <ul>
        {Object.entries(teams).map(([team, players]) => (
          <li key={team}>
            <button
              onClick={() => {
                setteamInput(team);
                setmembersInput(players);
              }}
            >
              {team}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TeamEditor() {
  return (
    <>
      <Appbar />
      <TeamChanger />
      <TeamList />
    </>
  );
}
