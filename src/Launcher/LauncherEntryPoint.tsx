import React from "react";
import ReactDOM from "react-dom/client";

import Launcher from "./Launcher";
import EntryPointGlobalConfigurations from "../EntryPointGloablConfigurations";

EntryPointGlobalConfigurations.runConfigurations();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Launcher />
        <section id="bottom-resize-buffer" />
    </React.StrictMode>,
);