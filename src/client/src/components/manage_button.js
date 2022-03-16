import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

export default function Manage_Button(props) {
  return (
    <button className="Manage_Button">
      <Link to="/tournament/manage">Manage Tournament</Link>
    </button>
  );
}
