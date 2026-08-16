import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import StoreProvider from "./context/StoreProvider.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StoreProvider>
    <>
      <App />
      <Toaster />
    </>
  </StoreProvider>,
);
