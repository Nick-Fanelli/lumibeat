import { createDir, readDir, writeFile } from "@tauri-apps/api/fs";
import { basename, dirname, join } from "@tauri-apps/api/path";
import { ask } from "@tauri-apps/api/dialog";
import ProjectStruct, { generateGenericProjectStruct, serializeProjectStruct } from "./ProjectDataStructure";
import { AudioPlayer } from "../App/AudioPlayer/AudioPlayer";

export type UUID = string;

namespace Project {

    export type Cue = {

        uuid: UUID
        name?: string
        number?: number
        audioPlayer?: AudioPlayer
    
    }

    export const getIndexByUUID = (cues: ReadonlyArray<Cue>, uuid: UUID): number => {
        return cues.findIndex(cue => cue.uuid === uuid);
    }

    export const getCueByUUID = (cues: ReadonlyArray<Cue>, uuid: UUID) : Cue | undefined => {
        return cues.find(cue => cue.uuid === uuid);
    }

    export const getIndexByUUIDCallback = (cues: ReadonlyArray<Cue>, uuid: UUID, callback: (index: number) => Cue[]) : Cue[] => {
        const index = getIndexByUUID(cues, uuid);

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

    export const saveShowFile = (showFilePath: string, projectStruct: ProjectStruct) : Promise<void> => {

        // TODO: RUN VALIDATIONS CHECKS ON SHOW FILE OBJECT
        return writeFile(showFilePath, serializeProjectStruct(projectStruct));

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
            saveShowFile(filepath, generateGenericProjectStruct(projectName))
        ])

        return filepath;
    }
 
}

export default Project;