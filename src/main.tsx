import React from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
// Self-hosted Nunito with the Vietnamese subset; files are precached by the service worker.
import "@fontsource/nunito/latin-400.css";
import "@fontsource/nunito/latin-600.css";
import "@fontsource/nunito/latin-700.css";
import "@fontsource/nunito/latin-800.css";
import "@fontsource/nunito/vietnamese-400.css";
import "@fontsource/nunito/vietnamese-600.css";
import "@fontsource/nunito/vietnamese-700.css";
import "@fontsource/nunito/vietnamese-800.css";
import "./styles/tokens.css";
import App from "./App";
// Shared design-language blocks go after the app's own styles.
import "./styles/focus.css";
import "./styles/scroll.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
);
if ("serviceWorker" in navigator && import.meta.env.PROD)
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
