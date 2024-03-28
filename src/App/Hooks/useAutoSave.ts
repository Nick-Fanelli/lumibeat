import { useEffect } from "react"
import ProjectStruct, { generateGenericProjectStruct } from "../../Project/ProjectDataStructure";
import Project from "../../Project/Project";
import { appStore } from "../State/AppStore";

let projectCache: ProjectStruct = generateGenericProjectStruct("");

const onAutoSave = (showFilePath: string, setWindowTitle: (_: string) => void) : Promise<void> => {

    let isModified = false;

    const storeState = appStore.getState();

    const cueListSnapshot = storeState.cueList.value;
    
    // Compare Snapshots
    if(cueListSnapshot !== projectCache.cueList) {
        projectCache.cueList = cueListSnapshot;
        isModified = true;
    }

    if(storeState.projectName.value !== projectCache.name) {
        projectCache.name = storeState.projectName.value;
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