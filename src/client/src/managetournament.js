import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { AlertContainer, alert } from "react-custom-alert";
import Appbar from './components/appbar';
import SaveButton from "./components/savebutton";
import { useParams } from 'react-router-dom'

import { Button, TextField, MenuItem, InputLabel, Select, Container, Slider } from '@mui/material'

function ManageTournament(props) {
  let [tournamentInfo, setTournamentInfo] = React.useState([]);

  React.useEffect(() => {
    console.log(props.tournamentId);
    fetch(process.env.REACT_APP_BACKEND_URL + `/api/tournament/${props.tournamentId}`)
      .then(res => res.json())
      .then(data => {
        
        if (data.status !== "OK") {
          showError(data.data);
        }
        
        setTournamentInfo(data.data);
        document.getElementById("editName").value = data.data.name;
      })
      .catch((err) => console.log(err.message));
  }, []);

  return (
    <>
      <form>
        <Container>
        <InputLabel htmlFor="editName">Edit name: </InputLabel>
        <TextField type="text" id="editName" />
        <InputLabel htmlFor="editDesc">Edit description: </InputLabel>
        <TextField type="text" id="editDesc" />
        <InputLabel htmlFor="editImage">
          Edit image: 
          <br />
          <Button variant="outlined" component="span" color="primary">
            Upload
          </Button>
        </InputLabel>
        <input
          type="file"
          id="editImage"
          accept="image/png, image/jpeg, image/jpg, image/gif, image/svg"
          style={{ display: 'none' }}
        />
        <InputLabel htmlFor="editStartDate">Edit Start Time:</InputLabel>
        <TextField type="datetime-local" id="editStartDate" />
        
        <InputLabel htmlFor="editEndDate">Edit End Time:</InputLabel>
        <TextField type="datetime-local" id="editEndDate" />
        </Container>
      </form>
    </>
  );
}

function AnnounceButton(props) {
  return (
    <Link to="/tournament/manage/announcement">
      <Button id="sendAnnon" variant="outlined" color="primary">Send Tournament Announcement</Button>
    </Link>
  );
}

function showError(error) {
  alert("Something went wrong. \n" + error);
  console.error(error);
}

function InviteButton(props) {
  function event() {
    copy();
    alertSuccess();
  }
  const copy = () => {
    navigator.clipboard.writeText("discord.gg/asura");
  };
  const alertSuccess = () =>
    alert({ message: "Copied to clipboard.", type: "success" });
  return (
    <Button id="createInvLink" onClick={event} variant="outlined" color="primary">
      Copy Invite Link
    </Button>
  );
}

export default function TournamentManager(props) {
  const { tournamentId } = useParams()
  return (
    <>
      <Appbar />
      <ManageTournament tournamentId={tournamentId} />
      <AnnounceButton />
      <InviteButton />
      <SaveButton />
      <AlertContainer floatingTime={5000} />
    </>
  );
}
