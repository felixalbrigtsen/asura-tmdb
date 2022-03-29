import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes, History } from "react-router-dom";
import { AppBar, Typography, Toolbar, CssBaseline, Box, Button, IconButton, Grid } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import logo from "./../Asura2222.png";

export default function Appbar(props) {
    return (
    <>
    <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} justifyContent="space-between" alignItems="center" align="center">
              <Grid item xs={2}>

                <Link to="/">
                  <img sx={{width: "10%"}} src={logo} alt="Tournament logo" className="mainIcon"></img>
                </Link>
                {/* <Typography variant="h6" component="div">
                  <Link to="/" style={{ color:'white'}}>
                    Asura Tournaments
                  </Link>
                </Typography> */}
              </Grid>
              <Grid item xs={8}>
                <Typography component="div"><h2>{props.pageTitle || ""}</h2></Typography>
              </Grid>
              <Grid item xs={2}>
                {/* <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ width: "5%", padding: "5% 10%" }}>
                  <MenuIcon />
                </IconButton> */}
              </Grid>
            </Grid>
          </Box>
        </Toolbar>
      </AppBar>
    </>
    );
}