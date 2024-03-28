import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { configureWeb3Modal } from "./connection/index.ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
configureWeb3Modal();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastContainer
      autoClose={3000}
      hideProgressBar={true}
      closeOnClick
      position={"top-right"}
    />
    <App />
  </React.StrictMode>
);
