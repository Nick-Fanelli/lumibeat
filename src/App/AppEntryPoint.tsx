import React from "react";
import ReactDOM from "react-dom/client";

import '../index.css'

import { initializeAudioSystem } from "./AudioPlayer/AudioPlayer";
import App from "./App";
import EntryPointGlobalConfigurations from "../EntryPointGloablConfigurations";
import { appStore } from "./State/AppStore";
import { Provider } from "react-redux";

EntryPointGlobalConfigurations.runConfigurations();

initializeAudioSystem();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={appStore}>
      <App />
    </Provider>
    <section id="bottom-resize-buffer" />
  </React.StrictMode>,
);