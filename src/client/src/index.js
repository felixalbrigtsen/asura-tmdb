import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ListElement from "./components/list_component";

ReactDOM.render(
  <React.StrictMode>
    <ListElement name="Weekend Warmup" competitors="16" date="29.04.2022" />
    <ListElement name="Saturday Showdown" competitors="8" date="30.04.2022" />
    <ListElement name="Sunday Funday" competitors="64" date="01.05.2022" />
  </React.StrictMode>,
  document.getElementById("root")
);
