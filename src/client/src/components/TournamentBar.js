import * as React from "react";
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Link, Route, Routes, History } from "react-router-dom";
import { Stack, Paper, Typography, Box, Button, Grid, Snackbar, IconButton } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';

function ClipboardButton(props) {
  const [open, setOpen] = React.useState(false);
  function copyString() {
    navigator.clipboard.writeText(props.clipboardContent || "");
    setOpen(true);
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') { return }
    setOpen(false);
  };
  const closeAction = <>
    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  </>
    
  return (
    <>
      <Button onClick={copyString} variant="outlined" color="primary" sx={{margin: "auto 5px"}} >Copy {props.name}</Button>
      <Snackbar open={open} autoHideDuration={1500} onClose={handleClose} message={props.name + " copied to clipboard"} action={closeAction} />
    </>
  );
}

function ButtonLink(props) {
  return (
    <Link to={`/tournament/${props.tournamentId}` + props.targetPath} >
        <Button variant="contained" color="primary" disabled={props.activeTitle === props.title || props.viewTournament} sx={{margin: "1.5vw", fontSize: "1.2em"}} >{props.title}</Button>
    </Link>
  );
}

export default function TournamentBar(props) {
    const { tournamentId } = useParams();
    return (
        <Paper sx={{width: "90vw", margin: "1.5% auto"}} component={Stack} direction="column" justifyContent="center" alignItems="center"> 
          <Stack direction="row" paddingTop={'0.5%'}>
            <ButtonLink targetPath="" tournamentId={tournamentId} activeTitle={props.pageTitle} title="View Tournament" viewTournament={props.viewTournament} />
            <ButtonLink targetPath="/manage" tournamentId={tournamentId} activeTitle={props.pageTitle} title="Edit Tournament" />
            <ButtonLink targetPath="/teams" tournamentId={tournamentId} activeTitle={props.pageTitle} title="Manage Teams" />
          </Stack>
          <Stack direction="row" paddingBottom={'0.5%'}>
            <ClipboardButton clipboardContent={"https://discord.gg/asura"} name="Discord Invite Link" />
            <ClipboardButton clipboardContent={"https://asura.feal.no/tournament/" + tournamentId} name="Tournament Link" />
          </Stack>
        </Paper>

    )
}