import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Appbar from './components/appbar';
import { Button, TextField, MenuItem, InputLabel, Select, Container, Slider } from '@mui/material'

function TeamList() {
 let teams = {"team 1": ["tom", "eric", "gustav"], "team 2": ["emma", "mari", "ida"],"team 3": ["ola", "ole", "ost"],"team 4": ["christine", "kristine", "kristhine"]}
 return (<div>
   <ul>
     {Object.entries(teams).map(([team, players]) => <li key={team} ><button>{team}</button></li>)}
   </ul>
 </div>)
}

function TeamChanger() {
  
  return (
  <>
    <form>
      <InputLabel htmlFor="teamInput">Team Name: </InputLabel>
      <TextField type="text" id="teamInput" variant="filled" label="Team Name:" />
      <InputLabel htmlFor="membersInput">Team Members: </InputLabel>
      <TextField type="text" id="membersInput" variant="filled" label="Members:"/>      
    </form>
  </>
  );
}

export default function TeamEditor() {
  return (
    <>
      <Appbar />
      <TeamChanger />
      <TeamList />
    </>
  );
}
