import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

export default function Tournament_Manager() {
  return (
    <React.Fragment>
      <h1 className="pageHeader">Tournament</h1>
      <br></br>
      <input
        className="Manage_Input"
        type="text"
        id="new_ame"
        placeholder="Edit Name"
      ></input>
      <br></br>
      <input
        className="Manage_Input"
        type="text"
        id="new_description"
        placeholder="Edit Name"
      ></input>
      <br></br>
      <input
        className="Manage_Input"
        type="image"
        id="new_image"
        placeholder="Edit Image"
      ></input>
      <br></br>
      <button>
        <Link to="/">Save and Exit</Link>
      </button>
    </React.Fragment>
  );
}
