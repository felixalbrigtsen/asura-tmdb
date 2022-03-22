import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

import Button from "@mui/material/Button";

export default function ManageButton(props) {
  return (
    <Link to="/tournament/manage">
      <Button className="ManageButton">Manage Tournament</Button>
    </Link>
  );
}
