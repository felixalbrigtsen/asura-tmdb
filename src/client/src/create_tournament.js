import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
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

function Save_Button(props) {
  return (
    <Link to="/">
      <button>Create Tournament!</button>
    </Link>
  );
}

export default function Create_Tournament(props) {
  return (
    <React.Fragment>
      <Home_Image />
      <Format_Selector />
      <Save_Button />
    </React.Fragment>
  );
}
