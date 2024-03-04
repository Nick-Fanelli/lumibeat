import CueList from "./CueList/CueList";
import Header from "./Header/Header";
import SplitPane from "./SplitPane/SplitPane";

import './App.css'
import Properties from "./Properties/Properties";
import StatusBar from "./StatusBar/StatusBar";
import { invoke } from "@tauri-apps/api";

import { useEffect } from "react";
import { signal } from "@preact/signals-react";

interface WindowInfo {

    window_uuid: string;

}

const windowInfo = signal<WindowInfo | null>(null);

const App = () => {

    useEffect(() => {
        invoke<string>('get_app_window_info').then((res) => {
            windowInfo.value = JSON.parse(res);
        });
    }, [windowInfo])

    if(windowInfo.value == null) {
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