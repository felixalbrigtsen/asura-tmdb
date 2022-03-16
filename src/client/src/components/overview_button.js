import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

export default function Overview_Button(props) {
  return (
    <button className="Overview_Button">
      <Link to="/tournament">View Tournament</Link>
    </button>
  );
}
