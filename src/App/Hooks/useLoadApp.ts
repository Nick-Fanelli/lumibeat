import { useEffect, useState } from "react";
import { WindowInfo } from "./useAppWindowInfo";
import { readTextFile } from "@tauri-apps/api/fs";
import { Project, ProjectUtils } from "../../Project/Project";

const useLoadApp = (appWindowInfo: WindowInfo | undefined, loadProjectIntoState : (_: Project) => void, setWindowTitle: (_: string) => void) : [ boolean, string | undefined ] => {

    const [value, setValue] = useState<[ boolean, string | undefined ]>([ false, undefined ]);

    useEffect(() => {

        if(appWindowInfo !== undefined) {

            const showFilePath = appWindowInfo.show_file_path;

            readTextFile(showFilePath).then((res) => {

                let projectStruct = ProjectUtils.deserializeProjectString(res);
                loadProjectIntoState(projectStruct);
                setValue([ true, showFilePath ]);

                setWindowTitle(projectStruct.name || "");

            })

        }

    }, [appWindowInfo, setValue]);

    return value;

}

export default useLoadApp;