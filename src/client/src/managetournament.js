import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import HomeImage from "./components/homeimage";
import SaveButton from "./components/savebutton";

function ManageTournament(props) {
  return (
    <React.Fragment>
      <form>
        <label>Edit name: </label>
        <input type="text" id="edtName" />
        <br />
        <label>Edit description: </label>
        <input type="text" id="edtDesc" />
        <br />
        <label>Edit image: </label>
        <input
          type="file"
          id="edtImage"
          accept="image/png, image/jpeg, image/jpg"
        />
        <br />
        <label>Edit start time: </label>
        <input type="date" id="edtDate" />
        <input type="time" id="edtTime" />
        <br />
        <br />
      </form>
      <button>.</button>
    </React.Fragment>
  );
}

export default function TournamentManager() {
  return (
    <React.Fragment>
      <HomeImage />
      <ManageTournament />
      <SaveButton />
    </React.Fragment>
  );
}
