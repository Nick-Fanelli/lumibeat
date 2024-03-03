import CueList from "./CueList/CueList";
import Header from "./Header/Header";
import SplitPane from "./SplitPane/SplitPane";

import './App.css'
import Properties from "./Properties/Properties";
import StatusBar from "./StatusBar/StatusBar";
import { invoke } from "@tauri-apps/api";

import { useEffect, useState } from "react";

interface WindowInfo {

    window_uuid: string;

}

const App = () => {

    const [windowInfo, setWindowInfo] = useState<WindowInfo | null>(null);

    useEffect(() => {
        invoke<string>('get_app_window_info').then((res) => {

            const windowInfo: WindowInfo = JSON.parse(res);
            setWindowInfo(windowInfo)

        })
    }, [setWindowInfo])

    if(windowInfo == null) {
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