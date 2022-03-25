import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { AlertContainer, alert } from "react-custom-alert";
import Appbar from "./components/appbar";
import { useParams } from "react-router-dom";
import { Button, TextField, MenuItem, InputLabel, Select, Container, Slider} from "@mui/material";

function submitChanges(event) {
  event.preventDefault();
  //TODO use refs to get values
  let tournamentName = document.getElementById("editName").value;
  let tournamentDescription = document.getElementById("editDesc").value;
  let tournamentImageFile = document.getElementById("editImage").files[0];
  let tournamentStartDate = document.getElementById("editStartDate").value;
  let tournamentEndDate = document.getElementById("editEndDate").value;

  if (!tournamentName || tournamentName == "") {
    alert("Tournament name cannot be empty");
    return;
  }
  if (!tournamentDescription || tournamentDescription == "") {
    alert("Tournament description cannot be empty");
    return;
  }
  if (!tournamentStartDate || tournamentStartDate == "") {
    alert("Tournament start date cannot be empty");
    return;
  }
  if (!tournamentEndDate || tournamentEndDate == "") {
    alert("Tournament end date cannot be empty");
    return;
  }

  if (tournamentStartDate > tournamentEndDate) {
    alert("Tournament start date cannot be after end date");
    return;
  }
  let today = new Date();
  if (tournamentStartDate < today || tournamentEndDate < today) {
    alert("Tournament start and end date must be after today");
    return;
  }

  let formData = new FormData();
  formData.append("name", tournamentName);
  formData.append("description", tournamentDescription);
  // formData.append("image", tournamentImageFile);
  formData.append("startDate", tournamentStartDate);
  formData.append("endDate", tournamentEndDate);
  // formData.append("teamLimit", tournamentMaxTeams);
  let body = new URLSearchParams(formData);

  fetch(process.env.REACT_APP_BACKEND_URL + "/api/tournament/create", {
    method: "POST",
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == "OK") {
        alert("Tournament managed successfully");
        window.location.href = "/";
      } else {
        showError(data.data);
      }
    })
    .catch((error) => showError(error));
}

function ManageTournament(props) {
  let [tournamentInfo, setTournamentInfo] = React.useState([]);

  React.useEffect(() => {
    console.log(props.tournamentId);
    fetch(
      process.env.REACT_APP_BACKEND_URL +
        `/api/tournament/${props.tournamentId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "OK") {
          showError(data.data);
        }

        setTournamentInfo(data.data);
        document.getElementById("editName").value = data.data.name;
        document.getElementById("editDesc").value = data.data.description;
        document.getElementById("editStartDate").value = data.data.startTime.slice(0, 16);
        document.getElementById("editEndDate").value = data.data.endTime.slice(0, 16);
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
            style={{ display: "none" }}
          />
          <InputLabel htmlFor="editStartDate">Edit Start Time:</InputLabel>
          <TextField type="datetime-local" id="editStartDate" />

          <InputLabel htmlFor="editEndDate">Edit End Time:</InputLabel>
          <TextField type="datetime-local" id="editEndDate" />
          <Button
            type="submit"
            variant="contained"
            onClick={submitChanges}
            color="primary"
          >
            Save Tournament Details
          </Button>
        </Container>
      </form>
    </>
  );
}

function AnnounceButton(props) {
  return (
    <Link to="/tournament/manage/announcement">
      <Button id="sendAnnon" variant="outlined" color="primary">
        Send Tournament Announcement
      </Button>
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
    <Button
      id="createInvLink"
      onClick={event}
      variant="outlined"
      color="primary"
    >
      Copy Invite Link
    </Button>
  );
}

export default function TournamentManager(props) {
  const { tournamentId } = useParams();
  return (
    <>
      <Appbar />
      <ManageTournament tournamentId={tournamentId} />
      <AnnounceButton />
      <InviteButton />
      <AlertContainer floatingTime={5000} />
    </>
  );
}
