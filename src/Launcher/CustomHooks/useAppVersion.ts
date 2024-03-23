import { getVersion } from "@tauri-apps/plugin-app";
import { useEffect, useState } from "react";

export const useAppVersion = () => {

    const [version, setVersion] = useState<string | undefined>(undefined);

    useEffect(() => {

        getVersion().then((res) => {
            console.log(res);
            setVersion(res)
        });

    }, [setVersion]);

    return version;

}