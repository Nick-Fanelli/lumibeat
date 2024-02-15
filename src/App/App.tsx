import CueList from "./CueList/CueList";
import Header from "./Header/Header";
import SplitPane from "./SplitPane/SplitPane";

import './App.css'
import Properties from "./Properties/Properties";
import StatusBar from "./StatusBar/StatusBar";
import { invoke } from "@tauri-apps/api";

import { useEffect } from "react";

interface WindowInfo {

    window_uuid: string;

}

const App = () => {    

    useEffect(() => {
        invoke<string>('get_app_window_info').then((res) => {

            const windowInfo: WindowInfo = JSON.parse(res);
            console.log(windowInfo);

        })
    })

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