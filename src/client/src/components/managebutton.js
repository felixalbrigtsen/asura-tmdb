import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

import Button from "@mui/material/Button";

export default function ManageButton(props) {
  return (
    <Link to={`/tournament/${props.tournamentId}/manage`} style={{textDecoration:'none'}}>
      <Button className="ManageButton" variant="contained" color="primary">Manage Tournament</Button>
    </Link>
  );
}
