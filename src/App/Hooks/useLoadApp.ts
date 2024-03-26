import { useEffect, useState } from "react";
import ProjectStruct, { deserializeProjectStruct } from "../../Project/ProjectDataStructure";
import { WindowInfo } from "./useAppWindowInfo";
import { readTextFile } from "@tauri-apps/api/fs";

const useLoadApp = (appWindowInfo: WindowInfo | undefined, loadProjectIntoState : (_: ProjectStruct) => void, setWindowTitle: (_: string) => void) : [ boolean, string | undefined ] => {

    const [value, setValue] = useState<[ boolean, string | undefined ]>([ false, undefined ]);

    useEffect(() => {

        if(appWindowInfo !== undefined) {

            const showFilePath = appWindowInfo.show_file_path;

            readTextFile(showFilePath).then((res) => {

                let projectStruct = deserializeProjectStruct(res);
                loadProjectIntoState(projectStruct);
                setValue([ true, showFilePath ]);

                setWindowTitle(projectStruct.name || "");

            })

        }

    }, [appWindowInfo, setValue, loadProjectIntoState]);

    return value;

}

export default useLoadApp;