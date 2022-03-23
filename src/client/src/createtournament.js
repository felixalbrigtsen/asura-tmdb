import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import HomeImage from "./components/homeimage";

function CreateButton(props) {
  return (
    <Link to="/">
      <button>Create Tournament!</button>
    </Link>
  );
}

function ParticipantLimit(props) {
  return (
    <div>
      Participant Limit:
      <select>
        <option value="4">4</option>
        <option value="8">8</option>
        <option value="16">16</option>
        <option value="16">32</option>
        <option value="64">64</option>
        <option value="128">128</option>
        <option value="256">256</option>
      </select>
    </div>
  );
}

function CreateForm(props) {
  return (
    <React.Fragment>
      <form>
        <label for="name">Tournament Name:</label>
        <input type="text" id="name" />
        <br />
        <label for="description">Description:</label>
        <input type="text" id="description" />
        <br />
        <label for="image">Tournament Image:</label>
        <input
          type="file"
          id="image"
          accept="image/png, image/jpeg, image/jpg"
        />
        <br />
        <label for="date">Start Date:</label>
        <input type="date" id="date" />
        <input type="time" id="time" />
        <br />
      </form>
    </React.Fragment>
  );
}

export default function CreateTournament(props) {
  return (
    <React.Fragment>
      <HomeImage />
      <CreateForm />
      <ParticipantLimit />
      <CreateButton />
    </React.Fragment>
  );
}
