import * as React from "react";
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Link, Route, Routes, History } from "react-router-dom";
import { Stack, Paper, Typography, Box, Button, Grid } from "@mui/material"

function ButtonLink(props) {
  return (
    <Link to={`/tournament/${props.tournamentId}` + props.targetPath} >
        <Button variant="contained" color="primary" disabled={props.activeTitle === props.title} sx={{margin: "15px", fontSize: "1.2em"}} >{props.title}</Button>
    </Link>
  );
}

export default function TournamentBar(props) {
    const { tournamentId } = useParams();
    return (
        <Paper sx={{width: "90vw", margin: "10px auto"}} component={Stack} direction="row" justifyContent="center">
            <ButtonLink targetPath="" tournamentId={tournamentId} activeTitle={props.pageTitle} title="View Tournament" />
            <ButtonLink targetPath="/manage" tournamentId={tournamentId} activeTitle={props.pageTitle} title="Edit Tournament" />
            <ButtonLink targetPath="/teams" tournamentId={tournamentId} activeTitle={props.pageTitle} title="Manage Teams" />
        </Paper>
    )
}