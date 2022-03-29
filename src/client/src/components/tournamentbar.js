import * as React from "react";
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Link, Route, Routes, History } from "react-router-dom";
import { Stack, Paper, Typography, Box, Button, Grid } from "@mui/material"

export default function TournamentBar(props) {
    const { tournamentId } = useParams()
    if (props.pageTitle == "Edit Tournament") {
        return(
            <Paper sx={{width: "90vw", margin: "10px auto"}} component={Stack} direction="row" justifyContent="center">
                <Link to={`/tournament/${tournamentId}/manage`} >
                <Button className="ManageButton" variant="contained" color="primary" disabled={true} sx={{margin: "15px", fontSize: "1.2em"}} >Manage Tournament</Button>
                </Link>
                <Link to={`/tournament/${tournamentId}/teams`} >
                    <Button className="OverviewButton" variant="contained" color="secondary" sx={{margin: "15px", fontSize: "1.2em"}} >Manage Teams</Button>
                </Link>
                <Link to={`/tournament/${tournamentId}`} >
                    <Button className="OverviewButton" variant="contained" color="success" sx={{margin: "15px", fontSize: "1.2em"}} >View Tournament</Button>
                </Link>
            </Paper>
            )
        } else if (props.pageTitle == "Tournament Matches") {
            return(
                <Paper sx={{width: "90vw", margin: "10px auto"}} component={Stack} direction="row" justifyContent="center">
                    <Link to={`/tournament/${tournamentId}/manage`} >
                    <Button className="ManageButton" variant="contained" color="primary" sx={{margin: "15px", fontSize: "1.2em"}} >Manage Tournament</Button>
                    </Link>
                    <Link to={`/tournament/${tournamentId}/teams`} >
                        <Button className="OverviewButton" variant="contained" color="secondary" sx={{margin: "15px", fontSize: "1.2em"}} >Manage Teams</Button>
                    </Link>
                    <Link to={`/tournament/${tournamentId}`} >
                        <Button className="OverviewButton" variant="contained" color="success"  disabled={true} sx={{margin: "15px", fontSize: "1.2em"}} >View Tournament</Button>
                    </Link>
                </Paper>
                ) 
        } else if (props.pageTitle == "Edit Teams") {
            return(
                <Paper sx={{width: "90vw", margin: "10px auto"}} component={Stack} direction="row" justifyContent="center">
                    <Link to={`/tournament/${tournamentId}/manage`} >
                    <Button className="ManageButton" variant="contained" color="primary" sx={{margin: "15px", fontSize: "1.2em"}} >Manage Tournament</Button>
                    </Link>
                    <Link to={`/tournament/${tournamentId}/teams`} >
                        <Button className="OverviewButton" variant="contained" color="secondary" disabled={true} sx={{margin: "15px", fontSize: "1.2em"}} >Manage Teams</Button>
                    </Link>
                    <Link to={`/tournament/${tournamentId}`} >
                        <Button className="OverviewButton" variant="contained" color="success" sx={{margin: "15px", fontSize: "1.2em"}} >View Tournament</Button>
                    </Link>
                </Paper>
            ) 
        }
}