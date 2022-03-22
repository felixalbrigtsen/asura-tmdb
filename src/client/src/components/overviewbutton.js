import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Button from '@mui/material/Button'

export default function OverviewButton(props) {
  return (
    <Link to="/tournament" style={{textDecoration:'none'}}>
      <Button className="OverviewButton">
        View Tournament
      </Button>
    </Link>
  );
}
