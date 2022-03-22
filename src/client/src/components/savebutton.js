import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

export default function SaveButton(props) {
  return (
    <Link to="/">
      <button>Create Tournament!</button>
    </Link>
  );
}
