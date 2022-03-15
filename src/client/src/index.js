import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ListElement from "./list_component";

ReactDOM.render(
  <React.StrictMode>
    <ListElement />
    <ListElement />
    <ListElement />
  </React.StrictMode>,
  document.getElementById("root")
);
