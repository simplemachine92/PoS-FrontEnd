import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
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

const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ThemeSwitcherProvider themeMap={themes} defaultTheme={"light"}>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="bg-headerBackground h-screen w-full bg-fill bg-center overflow-hidden">
            <div className="">
              <div class="flex items-center justify-center mt-10">
                <Spin />
              </div>
            </div>
          </div>
        }
      >
        <App subgraphUri={subgraphUri} />
      </Suspense>
    </BrowserRouter>
  </ThemeSwitcherProvider>,
  document.getElementById("root"),
);
