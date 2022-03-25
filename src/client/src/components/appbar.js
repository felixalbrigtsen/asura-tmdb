import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { AppBar, Typography, Toolbar, CssBaseline, Box, IconButton } from "@mui/material"
import Menu from '@mui/icons-material/Menu'
import HomeImage from "./homeimage";

export default function Appbar() {
    return (
    <>
    <CssBaseline />
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
        <HomeImage />
          
          <Typography variant="h6" component="div" sx={{ 
              flexGrow: 1,
              marginLeft: '2vw'
              }}>
              <Link to="/" style={{ textDecoration:'none', color:'white'}}>
                Asura Tournaments
              </Link>
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
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