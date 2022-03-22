import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import SaveButton from "./components/savebutton";
import HomeImage from "./components/homeimage";

function FormatSelector(props) {
  return (
    <div>
      <select>
        <option value="Single Elimination">Single Elimination</option>
        <option value="Double Elimination">Double Elimination</option>
      </select>
    </div>
  );
}

function CreateForm(props) {
  return (
    <React.Fragment>
      <form>
        <label for="organizer">Tournament Organizer:</label>
        <input type="text" id="organizer" />
        <br />
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
      <FormatSelector />
      <SaveButton />
    </React.Fragment>
  );
}
