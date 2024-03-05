import { getVersion } from "@tauri-apps/api/app";
import { useEffect, useState } from "react";

export const useAppVersion = () => {

    const [version, setVersion] = useState<string | undefined>(undefined);

    useEffect(() => {

        getVersion().then((res) => setVersion(res));

    }, [setVersion]);

    return version;

}