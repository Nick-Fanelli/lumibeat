import { AudioPlayer } from "../App/AudioPlayer/AudioPlayer";
import Project from "./Project";

type ProjectStruct = {

    name: string | undefined,
    cueList: Project.Cue[]

}

export type SerializedProjectStruct = string;

export const serializeProjectStruct = (projectStruct: ProjectStruct) : SerializedProjectStruct => {


    return JSON.stringify(projectStruct);

}

export const deserializeProjectStruct = (serializedProjectStruct: SerializedProjectStruct) : ProjectStruct => {

    let project = JSON.parse(serializedProjectStruct) as ProjectStruct;

    if(project.name == undefined)
        project.name = "";

    if(project.cueList == undefined)
        project.cueList = [];

    let updatedCueList: Project.Cue[] = [];

    project.cueList.forEach((cue) => {
        if(cue.audioPlayer) {
            cue.audioPlayer = new AudioPlayer((cue.audioPlayer as any).filepath);
            updatedCueList.push(cue);
        }
    })

    project.cueList = updatedCueList;

    return project;

}

export const generateGenericProjectStruct = (projectName: string) : ProjectStruct => {

    return {
        name: projectName,
        cueList: []
    };

}

export default ProjectStruct;