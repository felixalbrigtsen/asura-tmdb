import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

export default function ManageButton(props) {
  return (
    <button className="ManageButton">
      <Link to="/tournament/manage">Manage Tournament</Link>
    </button>
  );
}
