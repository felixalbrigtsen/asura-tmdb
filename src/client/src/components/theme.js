import * as React from 'react';
import ReactDOM from 'react-dom';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
    //   primary: {
    //   },
    //   secondary: {
    //   },
      pewterblue: {
          main: '#8fbcbb',
      },
      darkskyblue: {
        main: '#88c0d0'
      },
      darkpastelblue:{
          main: '#81a1c1'
      },
      rackley: {
          main: '#5e81ac'
      },
      gainsboro:{
          main: '#d8dee9'
      },
      brightgrey: {
          main: '#e5e9f0',
          light: '#e5e9f0'
      },
      lightslategray: {
        main: '#79869c'
      },
      cadetblue: {
        main: '#a0aaba'
      },
      red: {
          main: '#bf616a',  
      },
      copper: {
        main: '#d08770',
      },
      gold: {
        main: '#ebcb8b',
      },
      green: {
        main: '#a3be8c',
      },
      grape: {
        main: '#b48ead',
      }
    },
  });

export default theme;