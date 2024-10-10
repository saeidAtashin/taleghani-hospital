import "./custom.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
// Core styles
import "primereact/resources/primereact.min.css";

// Theme (choose one from node_modules/primereact/resources/themes)
import "primereact/resources/themes/saga-blue/theme.css";

// Icons
import "primeicons/primeicons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
