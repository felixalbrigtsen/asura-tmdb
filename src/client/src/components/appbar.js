import * as React from "react";
import { AppBar, Typography, Toolbar } from "@mui/material";
import HomeImage from "./homeimage";

export default function Appbar() {
    return (
        <AppBar position="relative" color="primary">
        <Toolbar>
          <HomeImage />
          <Typography>This is an Appbar</Typography>
        </Toolbar>
      </AppBar>
    );
}

