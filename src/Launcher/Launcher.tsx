import React from "react";
import ReactDOM from "react-dom/client";
import '../index.css'
import { invoke } from "@tauri-apps/api";

const Launcher = () => {

    return (

        <section id="root-app">

            <button onClick={() => {
                invoke('open_app')
            }}>Launch Other Window</button>

        </section>

    )

};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Launcher />
    <section id="bottom-resize-buffer" />
  </React.StrictMode>,
);