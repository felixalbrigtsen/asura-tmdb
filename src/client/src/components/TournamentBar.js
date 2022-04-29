import * as React from "react";
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Link, Route, Routes, History } from "react-router-dom";
import { Stack, Paper, Button, Snackbar, IconButton } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
      <Button onClick={copyString} variant="outlined" color="primary" sx={{margin:'1.5%', fontSize:['0.75em']}} >Copy {props.name}</Button>
      <Snackbar open={open} autoHideDuration={1500} onClose={handleClose} action={closeAction}>
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          {props.name + " copied to clipboard"}
        </Alert>
      </Snackbar>
    </>
  );
}

function ButtonLink(props) {
  return (
    <Link to={`/tournament/${props.tournamentId}` + props.targetPath} >
        <Button variant="contained" color="primary" disabled={props.activeTitle === props.title || props.viewTournament} sx={{fontSize:['0.7em','0.75em']}} >{props.title}</Button>
    </Link>
  );
}

export default function TournamentBar(props) {
    const { tournamentId } = useParams();
    return (
        <Paper sx={{width: ["90vw",], fontSize:['1rem','1rem','1.5rem'], margin: "1.5% auto"}} component={Stack} direction="column" justifyContent="center" alignItems="center"> 
          <Stack direction="row" paddingTop={'0.5%'} sx={{fontSize:['1rem','1rem','1.5rem','2rem'], margin:'1.5%'}} spacing={2}>
            <ButtonLink targetPath="" tournamentId={tournamentId} activeTitle={props.pageTitle} title="View Tournament" viewTournament={props.viewTournament}/>
            <ButtonLink targetPath="/manage" tournamentId={tournamentId} activeTitle={props.pageTitle} title="Edit Tournament" />
            <ButtonLink targetPath="/teams" tournamentId={tournamentId} activeTitle={props.pageTitle} title="Manage Teams" />
          </Stack>
          <Stack direction="row" sx={{paddingBottom:'0.5%', width: '80%', margin: '0 auto'}} component={Stack} justifyContent="center">
            <ClipboardButton clipboardContent={"https://discord.gg/asura"} name="Discord Invite Link" />
            <ClipboardButton clipboardContent={"https://asura.feal.no/tournament/" + tournamentId} name="Tournament Link" />
          </Stack>
        </Paper>
    )
}