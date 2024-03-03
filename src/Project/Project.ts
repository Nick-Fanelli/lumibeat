import { createDir, readDir, writeFile } from "@tauri-apps/api/fs";
import { basename, dirname, join } from "@tauri-apps/api/path";
import { ask } from "@tauri-apps/api/dialog";
import { generateSerializedGenericProjectStruct } from "./ProjectDataStructure";

namespace Project {

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
            writeFile(filepath, generateSerializedGenericProjectStruct(projectName)) // Write Project Directory
        ])

        return filepath;
    }
 
}

export default Project;