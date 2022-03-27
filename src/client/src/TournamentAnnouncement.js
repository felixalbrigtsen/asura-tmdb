import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Appbar from './components/appbar';

function Announcement() {
  return (
    <form>
      <label for="recipients">Recipients:</label>
      <select id="recipients">
        <option value="all">All</option>
        <option value="mail1@gmail.com">Person 1</option>
        <option value="mail2@gmail.com">Person 2</option>
        <option value="mail3@gmail.com">Person 3</option>
      </select>
      <br />
      <label for="subject">Subject:</label>
      <input type="text" id="subject"></input>
      <br />
      <input type="text" id="contents"></input>
      <Link to="/tournament/manage">
        <input type="submit"></input>
      </Link>
    </form>
  );
}

export default function TournamentAnnouncement() {
  return (
    <>
      <Appbar />
      <Announcement />
    </>
  );
}
