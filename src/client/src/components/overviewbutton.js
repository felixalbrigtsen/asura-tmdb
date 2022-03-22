import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

export default function OverviewButton(props) {
  return (
    <button className="OverviewButton">
      <Link to="/tournament">View Tournament</Link>
    </button>
  );
}
