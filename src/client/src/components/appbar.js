import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes, History } from "react-router-dom";
import { AppBar, Typography, Toolbar, CssBaseline, Box, Button, IconButton } from "@mui/material"
import Menu from '@mui/icons-material/Menu'
import HomeImage from "./homeimage";

export default function Appbar(props) {
    return (
    <>
    <CssBaseline />
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <HomeImage sx={{width: "10%"}} />
          <Typography variant="h6" component="div" sx={{ marginLeft: '2vw', width: "20%;" }}>
              <Link to="/" style={{ textDecoration:'none', color:'white'}}>
                Asura Tournaments
              </Link>
          </Typography>
          {/* <Button sx={{width: "5%", color: "white"}} onClick={History.goBack}>Back</Button> */}

          <Typography component="div" sx={{margin: "auto auto"}}><h2>{props.pageTitle || ""}</h2></Typography>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ marginRight: 2, width: "5%", marginLeft: "30%" }}
          >
            <Menu />
          </IconButton>
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
    </>
    );
}