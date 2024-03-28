import React from "react";
import ReactDOM from "react-dom/client";

import Launcher from "./Launcher";
import EntryPointGlobalConfigurations from "../EntryPointGloablConfigurations";
import { launcherStore } from "./State/LauncherStore";
import { Provider } from "react-redux";

EntryPointGlobalConfigurations.runConfigurations();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={launcherStore}>
            <Launcher />
        </Provider>
        <section id="bottom-resize-buffer" />
    </React.StrictMode>,
);