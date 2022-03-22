import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Home_Image from "./components/home_image";

function Manage_Tournament(props) {
  return (
    <form>
      <label>Edit name: <br />
        <input type="text" id="edtName" /><br />
      </label>
      <label>Edit description: <br />
        <input type="text" id="edtDesc" /><br />
      </label>
      <label>Edit image: <br />
        <input type="image" id="edtImage" /><br />
      </label>
      <label>Edit start time: <br />
        <input type="date" id="edtTime" /><br />
      </label>
    </form>
  )
}


export default function Tournament_Manager() {
  return (
    <React.Fragment>
      <Home_Image />
      <Manage_Tournament />
      <Save_Button />
    </React.Fragment>
  );
}
