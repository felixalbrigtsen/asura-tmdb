import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { AlertContainer, alert } from "react-custom-alert";
import Appbar from './components/appbar';
import SaveButton from "./components/savebutton";
import { useParams } from 'react-router-dom'

import { Button, TextField, MenuItem, InputLabel, Select, Container, Slider } from '@mui/material'

function ManageTournament(props) {
  const { tournamentId } = useParams()
  let [tournamentInfo, setTournamentInfo] = React.useState([]);

  React.useEffect(() => {
    fetch(process.env.BACKEND_URL + `/api/tournament/${tournamentId}`)
      .then(res => res.json())
      .then(data => {
        
        if (data.status != "OK") {
          // Do your error thing
          console.error(data.data);
          return;
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
  return (
    <>
      <Appbar />
      <ManageTournament />
      <AnnounceButton />
      <InviteButton />
      <SaveButton />
      <AlertContainer floatingTime={5000} />
    </>
  );
}
