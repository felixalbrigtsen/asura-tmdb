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
        <br />
        <button>Save Team</button>
      </form>
    </>
  );
}
var teams = {
  "team 1": ["tom", "eric", "gustav"],
  "team 2": ["emma", "mari", "ida"],
  "team 3": ["ola", "ole", "ost"],
  "team 4": ["christine", "kristine", "kristhine"],
};
function TeamList() {
  const [teamInput, setteamInput] = React.useState("");
  const [membersInput, setmembersInput] = React.useState("");
  React.useEffect(() => {
    document.getElementById("teamInput").value = teamInput;
    document.getElementById("membersInput").value = membersInput;
  });
  return (
    <div>
      Registered teams:
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

function TeamRemover() {
  return (
    <div>
      Remove team:{" "}
      <select>
        {Object.entries(teams).map(([team, players]) => (
          <option value={team}>{team}</option>
        ))}
      </select>
      <button>Remove</button>
    </div>
  );
}

function Save_Button() {
  return (
    <Link to="/tournament">
      <button>Save and Exit</button>
    </Link>
  );
}

export default function TeamEditor() {
  return (
    <>
      <Appbar />
      <TeamChanger />
      <TeamList />
      <TeamRemover />
      <Save_Button />
    </>
  );
}
