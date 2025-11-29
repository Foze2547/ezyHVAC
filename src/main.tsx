import { LanguageProvider } from "./contexts/LanguageContext";
import App from "./App";
import React from "react";
import { createRoot } from "react-dom/client";
import './index.css'

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
