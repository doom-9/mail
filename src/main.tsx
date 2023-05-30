import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./samples/node-api";
import "./index.scss";
import { ApolloProvider } from "@apollo/client";
import client from "./utils/graphql";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);

postMessage({ payload: "removeLoading" }, "*");
