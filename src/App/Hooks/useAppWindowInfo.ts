import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react"

export type WindowInfo = {

    show_file_path: string
    window_uuid: string

}

const useAppWindowInfo = () : WindowInfo | undefined => {

    const [appWindowInfo, setAppWindowInfo] = useState<WindowInfo | undefined>(undefined);

    useEffect(() => {

        invoke<string>('get_app_window_info').then((res) => {
            setAppWindowInfo(JSON.parse(res) as WindowInfo);
        });

    }, []);

    return appWindowInfo;

}

export default useAppWindowInfo;