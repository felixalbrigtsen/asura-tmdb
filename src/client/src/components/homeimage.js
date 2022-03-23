import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import logo from "./../Asura2222.png";

export default function HomeImage() {
  return (
    <Link to="/">
      <img src={logo} alt="Tournament logo" className="mainIcon"></img>
    </Link>
  );
}
