import CueList from "./CueList/CueList";
import Header from "./Header/Header";
import SplitPane from "./SplitPane/SplitPane";

import './App.css'
import Properties from "./Properties/Properties";
import StatusBar from "./StatusBar/StatusBar";
import { invoke } from "@tauri-apps/api";

import { useEffect } from "react";
import { signal } from "@preact/signals-react";
import ProjectStruct, { deserializeProjectStruct } from "../Project/ProjectDataStructure";
import { readTextFile } from "@tauri-apps/api/fs";

interface WindowInfo {

    window_uuid: string,
    show_file_path: string

}

const windowInfo = signal<WindowInfo | null>(null);
const currentProject = signal<ProjectStruct | null>(null);

const App = () => {

    useEffect(() => {
        invoke<string>('get_app_window_info').then((res) => {
            windowInfo.value = JSON.parse(res);

            const showFilePath = windowInfo.value?.show_file_path;

            if(showFilePath) {

                readTextFile(showFilePath).then((res) => {
                    currentProject.value = deserializeProjectStruct(res);

                    invoke('set_window_title', {
                        windowUuid: windowInfo.value?.window_uuid,
                        title: currentProject.value.name
                    })

                });

            }
        });
    }, [windowInfo])

    if(windowInfo.value == null || currentProject.value == null) {
        return <h1>Loading...</h1>
    }

    return (

        <section id="root-app">

            <Header />

            <SplitPane>
                
                <CueList />
                <Properties />

            </SplitPane>

            <StatusBar />
            
        </section>

    )

};

export default App;