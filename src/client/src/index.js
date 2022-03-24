import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./frontpage.js";
import theme from './components/theme';
import { ThemeProvider } from "@emotion/react";

ReactDOM.render(
  <>
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
  </>,
  document.getElementById("root")
);
