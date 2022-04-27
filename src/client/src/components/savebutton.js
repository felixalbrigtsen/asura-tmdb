import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

import Button from "@mui/material/Button";

export default function SaveButton(props) {
  return (
    <Link to="/">
      <Button variant="outlined" color="primary">Save and Exit</Button>
    </Link>
  );
}