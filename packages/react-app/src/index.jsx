import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import { Spin } from "antd";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

const themes = {
  light: `${process.env.PUBLIC_URL}/landing.css`,
};

ReactDOM.render(
  <ThemeSwitcherProvider themeMap={themes} defaultTheme={"light"}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeSwitcherProvider>,
  document.getElementById("root"),
);
