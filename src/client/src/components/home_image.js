import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import logo from "./../Asura2222.png";

export default function Home_Image() {
  return (
    <Link to="/">
      <img src={logo} alt="Tournament logo"></img>
    </Link>
  );
}
