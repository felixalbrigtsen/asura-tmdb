import * as React from "react";
import { AppBar, Typography, Toolbar } from "@mui/material";
import HomeImage from "./homeimage";
import CssBaseline from '@mui/material/CssBaseline'

export default function Appbar() {
    return (
        <>
        <CssBaseline />
        <AppBar position="relative" color="primary">
        <Toolbar>
          <HomeImage />
          <Typography>This is an Appbar</Typography>
        </Toolbar>
      </AppBar>
      </>
    );
}

