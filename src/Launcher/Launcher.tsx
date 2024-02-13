import React from "react";
import ReactDOM from "react-dom/client";
import '../index.css'

import { open, save } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";

const Launcher = () => {

    const launchOpenDialog = () => {

    }
    
    const launchCreateDialog = () => {

        save({
            
        }).then((res) => {
            console.log(res);
        })

        // open({
        //     directory: true,
        //     multiple: false,
        //     title: "Create New Project",
        // }).then((res) => {
        //     console.log(res);
        // });

    }

    return (

        <section id="root-app">

            <button onClick={launchCreateDialog}>Create Project</button>
            <button onClick={() => invoke('open_app')}>Open Project</button>

        </section>

    )

};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Launcher />
        <section id="bottom-resize-buffer" />
    </React.StrictMode>,
);