import * as React from "react";
import { BrowserRouter as Router, Link, Route, Routes, History } from "react-router-dom";
import { AppBar, Typography, Toolbar, CssBaseline, Box, Button, IconButton, Grid, Menu, MenuItem, Container } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import logo from "./../Asura2222.png";

var isLoggedIn = false; // props.isLoggedIn;

function LoggedInMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    console.log("Logged out");
    isLoggedIn = false;
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton size="large" edge="start" color="inherit" aria-label="menu"  onClick={handleClick}>
        <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{'aria-labelledby': 'basic-button',}} sx={{position:"absolute"}}>
          <Link to="/" style={{color:"black"}}><MenuItem onClick={handleClose}><Button endIcon={<AccountCircleIcon />}>Profile</Button></MenuItem></Link>
          <Link to="/history" style={{color:"black"}}><MenuItem onClick={handleClose}><Button endIcon={<HistoryIcon />}>History</Button></MenuItem></Link>
          <Link to="/" style={{color:"black"}}><MenuItem onClick={logout}><Button endIcon={<LogoutIcon />} >Logout</Button></MenuItem></Link>
      </Menu> 
    </> 
  );  
}


function NotLoggedInButton() {

  const login = () => {
    console.log("Logged in");
    isLoggedIn = true;
  }

  return (
    <>
    <Link to="/login" style={{color:"white"}}>
      <Button sx={{color:"white"}} onClick={login} endIcon={<LoginIcon />}>
        Login
        </Button>
      </Link>
    </>
  );
}

export default function Appbar(props) {
    return (
    <>
    <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} justifyContent="space-between" alignItems="center" align="center">
              <Grid item xs={2}>
              <Box sx={{ width:"100%", height: "100%", justifyContent:"left", align: "center", alignItems:"center", margin: "none", padding: "none", color: "white" ,display: "flex", flexFlow: "row"}}>
                <Link to="/">
                  <img sx={{width: "10%"}} src={logo} alt="Tournament logo" className="mainIcon"></img>
                </Link>
                  { props.pageTitle !== "Asura Tournaments" &&
                  <Link to="/" style={{color:"white"}}>
                    <Typography component="div" align="center">
                          Home
                    </Typography>
                  </Link>
                  }
              </Box>
              </Grid>    
              <Grid item xs={8}>
                <Typography component="div"><h2>{props.pageTitle || ""}</h2></Typography>
              </Grid>
              { props.pageTitle !== "Sign in" ?
                <Grid item xs={2}>
                  { isLoggedIn ? <LoggedInMenu /> : <NotLoggedInButton /> } 
                </Grid> : 
                <Grid item xs={2}>
                </Grid>
              }
            </Grid>
          </Box>
        </Toolbar>
      </AppBar>
    </>
    );
}