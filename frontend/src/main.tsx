import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { ToastHost } from "./components/ui/ToastHost";
import { installMutationToasts } from "./lib/installMutationToasts";
import "./styles.css";

installMutationToasts();

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastHost />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
