import { useEffect } from "react"
import ProjectStruct, { generateGenericProjectStruct } from "../../Project/ProjectDataStructure";
import Project from "../../Project/Project";
import AppState from "../AppState";

let projectCache: ProjectStruct = generateGenericProjectStruct("");

const onAutoSave = (showFilePath: string, setWindowTitle: (_: string) => void) : Promise<void> => {

    let isModified = false;

    const cuesSnapshot = AppState.cues.value;
    
    // Compare Snapshots
    if(cuesSnapshot !== projectCache.cueList) {
        projectCache.cueList = cuesSnapshot;
        isModified = true;
    }

    if(AppState.projectName.value !== projectCache.name) {
        projectCache.name = AppState.projectName.value;
        setWindowTitle(projectCache.name || "");
        isModified = true;
    }

    // Save to Project File
    if(isModified) {
        
        console.debug("Saving to showfile...")
        return Project.saveShowFile(showFilePath, projectCache);

    }

    return Promise.resolve();
    
}


const useAutoSave = (showFilePath: string | undefined, setWindowTitle: (_: string) => void) : () => Promise<void> => {
    
    const onManualSaveCallback = () : Promise<void> => {
        if(showFilePath) {
            return onAutoSave(showFilePath, setWindowTitle);
        }

        return Promise.resolve();
    }

    useEffect(() => {

        const interval = setInterval(() => {
            if(showFilePath !== undefined)
                onAutoSave(showFilePath, setWindowTitle);
        }, 2000);

        return () => {
            clearInterval(interval);
        }

    }, [showFilePath, ]);

    return onManualSaveCallback;

}

export default useAutoSave;