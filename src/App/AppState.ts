import { signal } from "@preact/signals-react";
import Project from "../Project/Project";
import { v4 as uuidv4 } from 'uuid';
import ProjectStruct from "../Project/ProjectDataStructure";

// Project State

namespace AppState {

    export const cues = signal<Project.Cue[]>([]);

    export const addCue = () => {

        cues.value = [...cues.value, { uuid: uuidv4(), name: "Some Name" }];

    }

    export const loadProjectIntoState = (projectStruct: ProjectStruct) => {

        cues.value = projectStruct.cueList;

    }
    
}

export default AppState;