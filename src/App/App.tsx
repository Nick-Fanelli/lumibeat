import CueList from "./CueList/CueList";
import Header from "./Header/Header";
import SplitPane from "./SplitPane/SplitPane";

import './App.css'
import Properties from "./Properties/Properties";
import StatusBar from "./StatusBar/StatusBar";

import useAppWindowInfo from "./Hooks/useAppWindowInfo";
import useLoadApp from "./Hooks/useLoadApp";
import useAutoSave from "./Hooks/useAutoSave";
import AppState from "./AppState";
import useCatchAppClose from "./Hooks/useCatchAppClose";
import { invoke } from "@tauri-apps/api";

const setWindowTitle = (windowTitle: string) => {
    invoke('set_window_title', {
        title: windowTitle
    });
}

const App = () => {

    const appWindowInfo = useAppWindowInfo();
    const [ isLoaded, showFilePath ] = useLoadApp(appWindowInfo, AppState.loadProjectIntoState, setWindowTitle);

    const onManualSaveCallback = useAutoSave(showFilePath, setWindowTitle);
    useCatchAppClose(onManualSaveCallback);

    if(!isLoaded) {
        return <h1>Loading...</h1>
    }

    return (

        <section id="root-app">

            <Header />

            <SplitPane>
                
                <CueList cues={AppState.cues} />
                <Properties />

            </SplitPane>

            <StatusBar />
            
        </section>

    )

};

export default App;