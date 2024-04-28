import CueList from "./CueList/CueList";
import Header from "./Header/Header";
import SplitPane from "./SplitPane/SplitPane";

import './App.css'
import Properties from "./Properties/Properties";
import StatusBar from "./StatusBar/StatusBar";

import useAppWindowInfo from "./Hooks/useAppWindowInfo";
import useLoadApp from "./Hooks/useLoadApp";
import useAutoSave from "./Hooks/useAutoSave";
import useCatchAppClose from "./Hooks/useCatchAppClose";
import { invoke } from "@tauri-apps/api";
import { useDispatch } from "react-redux";
import { setProjectName } from "./State/Project/projectNameSlice";
import { setCueList } from "./State/Project/cueListSlice";
import { Project } from "../Project/Project";
import { AudioPlayer } from "./AudioPlayer/Audio";

const setWindowTitle = (windowTitle: string) => {
    invoke('set_window_title', {
        title: windowTitle
    });
}

const App = () => {

    const dispatch = useDispatch();

    const loadProjectIntoState = (projectStruct: Project) => {
        
        dispatch(setProjectName(projectStruct.name || ""));
        dispatch(setCueList(projectStruct.cueList));

        // Pre-Load Audio Players
        projectStruct.cueList.forEach((cue) => {

            if(cue.audioSourceFile) {
                // Generate the audio players to be cached automatically
                new AudioPlayer(cue.audioSourceFile);
            }

        });

    }

    const appWindowInfo = useAppWindowInfo();
    const [ isLoaded, showFilePath ] = useLoadApp(appWindowInfo, loadProjectIntoState, setWindowTitle);

    const onManualSaveCallback = useAutoSave(showFilePath, setWindowTitle);

    useCatchAppClose(appWindowInfo, onManualSaveCallback);

    if(!isLoaded) {
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