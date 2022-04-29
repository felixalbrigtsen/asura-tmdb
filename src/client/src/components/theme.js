import * as React from 'react';
import ReactDOM from 'react-dom';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      pewterblue: {
        main: '#8fbcbb',
        contrastText: '#fff',
      },
      darkskyblue: {
        main: '#88c0d0',
        contrastText: '#fff',
      },
      darkpastelblue:{
        main: '#81a1c1',
        contrastText: '#fff',
      },
      rackley: {
        main: '#3270a6',
        contrastText: '#fff',
      },
      gainsboro:{
        main: '#d8dee9',
        contrastText: '#fff',
      },
      brightgrey: {
        main: '#e5e9f0',
        contrastText: '#fff',
      },
      lightslategray: {
        main: '#79869c',
        contrastText: '#fff',
      },
      cadetblue: {
        main: '#a0aaba',
        contrastText: '#fff',
      },
      red: {
        main: '#bf616a', 
        contrastText: '#fff', 
      },
      copper: {
        main: '#d08770',
        contrastText: '#fff',
      },
      gold: {
        main: '#ebcb8b',
        contrastText: '#fff',
      },
      green: {
        main: '#a3be8c',
        contrastText: '#fff',
      },
      grape: {
        main: '#b76bbf',
        contrastText: '#fff',
      },
      background: {
        default: '#f0f2f2',
      }
    },
  });

export default theme;