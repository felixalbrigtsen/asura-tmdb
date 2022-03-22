import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Save_Button from "./components/save_button";
import Home_Image from "./components/home_image";

function Format_Selector(props) {
  return (
    <div>
      <select>
        <option value="Single Elimination">Single Elimination</option>
        <option value="Double Elimination">Double Elimination</option>
      </select>
    </div>
  );
}

function Create_Form(props) {
  return (
    <form>
      <label for="organizer">Tournament Organizer:</label><br />
      <input type="text" id="organizer" /><br />
      <label for="name">Tournament Name:</label><br />
      <input type="text" id="name" /><br />
      <label for="description">Description</label><br />
      <input type="text" id="description" /><br />
      <label for="image">Tournament Image:</label><br />
      <input type="image" id="image" /><br />
      <label for="date">Start Time:</label><br />
      <input type="date" id="date" /><br />
    </form>
  )
}

export default function Create_Tournament(props) {
  return (
    <React.Fragment>
      <Home_Image />
      <Create_Form />
      <Format_Selector />
      <Save_Button />
    </React.Fragment>
  );
}
