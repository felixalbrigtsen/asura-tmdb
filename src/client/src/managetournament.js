import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { AlertContainer, alert } from "react-custom-alert";
import HomeImage from "./components/homeimage";
import SaveButton from "./components/savebutton";

function ManageTournament(props) {
  return (
    <React.Fragment>
      <form>
        <label>Edit name: </label>
        <input type="text" id="editName" />
        <br />
        <label>Edit description: </label>
        <input type="text" id="editDesc" />
        <br />
        <label>Edit image: </label>
        <input
          type="file"
          id="editImage"
          accept="image/png, image/jpeg, image/jpg"
        />
        <br />
        <label>Edit start time: </label>
        <input type="date" id="editDate" />
        <input type="time" id="editTime" />
        <br />
        <br />
      </form>
    </React.Fragment>
  );
}

function AnnounceButton(props) {
  return (
    <Link to="/tournament/manage/announcement">
      <button id="sendAnnon">Send Tournament Announcement</button>
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
    <button id="createInvLink" onClick={event}>
      Copy Invite Link
    </button>
  );
}

//navigator.clipboard.writeText("discord.gg/asura")
export default function TournamentManager() {
  return (
    <React.Fragment>
      <HomeImage />
      <ManageTournament />
      <AnnounceButton />
      <InviteButton />
      <SaveButton />
      <AlertContainer floatingTime={5000} />
    </React.Fragment>
  );
}
