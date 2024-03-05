import { exists, readTextFile, writeFile } from "@tauri-apps/api/fs";
import { appCacheDir, join } from "@tauri-apps/api/path";

export namespace Cache {

    export type RecentProject = {

        projectName: string,
        showfilePath: string
    
    }
    
    export type ApplicationCache = {
    
        recentProjects: RecentProject[]
    
    }
    
    export var cache: ApplicationCache = {
        recentProjects: []
    };
    
    export const commitCache = async () : Promise<void> => {
    
        const cacheFilepath = await getAppCacheFilepath();

        return writeFile(cacheFilepath, JSON.stringify(cache));

    }
    
    export const loadCache = async () : Promise<ApplicationCache> => {

        const cacheFilepath = await getAppCacheFilepath();
        const cacheExists = await exists(cacheFilepath);

        if(!cacheExists) {
            await commitCache();
        }

        const fileData = await readTextFile(cacheFilepath);
        cache = JSON.parse(fileData) as ApplicationCache;

        return cache;

    }

    let appCacheFilepath: string | undefined = undefined;

    export const getAppCacheFilepath = async () => {
        
        if(appCacheFilepath == undefined) {
            const appCacheDirectory = await appCacheDir();
            appCacheFilepath = await join(appCacheDirectory, "lumibeat-cache.json");
        }

        console.log(appCacheFilepath);

        return appCacheFilepath;

    }

}
