import React from "react";
import ReactDOM from "react-dom/client";

import '../index.css'

import { initializeAudioSystem } from "./AudioPlayer/AudioPlayer";
import App from "./App";

initializeAudioSystem();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <App />
    // <section id="bottom-resize-buffer" />
  // </React.StrictMode>,
);