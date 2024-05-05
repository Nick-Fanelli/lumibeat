import { ask } from "@tauri-apps/api/dialog";
import { createDir, readDir, writeFile } from "@tauri-apps/api/fs";
import { basename, dirname, join } from "@tauri-apps/api/path";
import { v4 as uuidv4 } from 'uuid';

export type UUID = string;

export type Trigger = {

    uuid: UUID
    timestamp: number
    networkCue?: number

}

export type Cue = {

    uuid: UUID,
    name?: string,
    number?: number,
    audioSourceFile?: string
    triggers?: Trigger[]

}

export type Project = {

    name: string | undefined,
    cueList: Cue[]

}

export namespace ProjectUtils {

    // ============================================================================
    // Serialization
    // ============================================================================

    export const serializeProject = (project: Project) : string => {

        return JSON.stringify(project, null, "\t");

    }

    export const deserializeProjectString = (projectString: string) : Project => {

        let project = JSON.parse(projectString) as Project;

        if(project.name == undefined)
            project.name = "";

        if(project.cueList == undefined)
            project.cueList = [];
        
        return project;

    }

    export const saveProjectToFile = (filepath: string, project: Project) : Promise<void> => {

        return writeFile(filepath, serializeProject(project));

    }

    export const initializeProjectDirectoryFromShowfile = async (filepath: string) : Promise<string | null>  => {

        // Ensure file ending
        const filepathParts = filepath.split('.');
        const fileExtension = filepathParts[filepathParts.length - 1];

        if(fileExtension != "lumishow") {
            console.error("Invalid Filepath Extension");
            return null;
        }

        // Get parent directory
        const parentDirectory = await dirname(filepath);
        const rawParentDirectoryContents = await readDir(parentDirectory);

        const parentDirectoryContents = rawParentDirectoryContents.filter((item) => {
            return !item.name?.startsWith('.');
        });
    
        // Check to see if parent dir is empty
        if(parentDirectoryContents.length > 0) {

            const result = await ask("Are you sure you want to continue? You may override contents in this directory. You should make a blank directory!");

            if(!result) {
                return null;
            }

        }

        // Create Resources Directory
        const resourcesPath = await join(parentDirectory, "Resources");

        const projectName = (await basename(filepath)).split('.')[0];

        await Promise.all([
            createDir(resourcesPath), // Create Resources Directory
            saveProjectToFile(filepath, {
                name: projectName,
                cueList: []
            })
        ])

        return filepath;
    }

}

export namespace CueListUtils {

    export const getCueIndexByUUID = (cues: ReadonlyArray<Cue>, uuid: UUID) : number => {
        return cues.findIndex(cue => cue.uuid === uuid);
    }

    export const getCueByUUID = (cues: ReadonlyArray<Cue>, uuid: UUID) : Cue | undefined => {
        return cues.find(cue => cue.uuid === uuid);
    }

    export const getIndexByUUIDCallback = (cues: ReadonlyArray<Cue>, uuid: UUID, callback: (index: number) => Cue[]) : Cue[] => {
        const index = getCueIndexByUUID(cues, uuid);

        if(index === -1) {
            console.warn(`Could not find cue with UUID of: '${uuid}' in the array of cues`);
            return [...cues];
        }

        return callback(index);
    }

    export const removeCueFromListByUUID = (constCues: ReadonlyArray<Cue>, uuid: UUID) => {

        let cues = [...constCues];


        return getIndexByUUIDCallback(cues, uuid, (index: number) => {

            cues.splice(index, 1);

            return cues;

        });

    }

}

export namespace TriggerUtils {

    export const createUUID = () => {
        
        const parts = uuidv4().split("-");
        return parts[parts.length - 1];

    }

    export const sortTriggers = (triggers: ReadonlyArray<Trigger>) : Trigger[] => {

        let tArray = [...triggers];

        return tArray.sort((t1, t2) => {

            if(t1.timestamp == t2.timestamp)
                return 0;

            return (t1.timestamp > t2.timestamp) ? 1 : -1;

        });

    }

    export const createTrigger = (triggers: ReadonlyArray<Trigger> | undefined, timestamp: number) : Trigger[] => {

        if(!triggers)
            triggers = [];

        let uuid: string = "";
        let isCollision = true;

        // Get UUID
        while(isCollision) {
            uuid = createUUID();

            isCollision = false;

            for(let i = 0; i < triggers.length; i++) {
                if(triggers[i].uuid === uuid) {
                    isCollision = true;
                    break;
                }
            }
        }

        // Auto-Calculate Network Cue Number
        let sortedTriggers = sortTriggers(triggers);
        let networkCue = undefined;

        if(sortedTriggers.length > 0) {

            let previousIndex = -1;

            for(let i = 0; i < sortedTriggers.length; i++) {
                if(sortedTriggers[i].timestamp < timestamp) {
                    previousIndex = i;
                }
            }


            if(previousIndex != -1) {

                const pT = sortedTriggers[previousIndex];

                if(previousIndex + 1 <= sortedTriggers.length - 1) { // Is between two cues

                    if(pT.networkCue) {

                        if(pT.networkCue % 1 == 0) {
                            networkCue = pT.networkCue + 0.5;
                        } else {
                            networkCue = pT.networkCue + 0.1;
                        }

                    }

                } else { // Is last cue 

                    if(pT.networkCue) {

                        if(pT.networkCue % 1 == 0) {
                            networkCue = pT.networkCue + 1;
                        } else {
                            networkCue = pT.networkCue + 0.1;
                        }

                    }

                }

            }

        }

        const newTrigger : Trigger = { uuid: uuid, timestamp: timestamp, networkCue: networkCue };
        return sortTriggers([...sortedTriggers, newTrigger]);

    }

    export const setTriggerNetworkCue = (triggers: ReadonlyArray<Trigger> | undefined, triggerUUID: UUID, networkCueNumber: number | undefined) : Trigger[] | undefined => {

        if(!triggers) {
            console.error("Can not set trigger network cue on cue without triggers");
            return triggers;
        }

        const triggerIndex = triggers.findIndex(trigger => trigger.uuid === triggerUUID);

        if(triggerIndex == -1) {
            console.error("Can not modify network cue number on trigger that doesn't exist!");
            return [...triggers];
        }

        let modifiedTriggers = [...triggers];
        
        const currentTrigger = triggers[triggerIndex];
        modifiedTriggers[triggerIndex] = { ...currentTrigger, networkCue: networkCueNumber };

        return modifiedTriggers;

    }

}