import { invoke } from "@tauri-apps/api";
import { confirm } from "@tauri-apps/api/dialog";
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { WindowInfo } from "./useAppWindowInfo";

const onCloseCaught = async (onManualSaveCallback : () => Promise<void>) => {

    const result = await confirm("Are you sure you want to close this show file. Your project is auto-saved...", {
        okLabel: "Close Show File"
    });

    if(result) {
        await onManualSaveCallback();

        invoke('close_window');
    }

}

const useCatchAppClose = (appWindowInfo: WindowInfo | undefined, onManualSaveCallback : () => Promise<void>) => {

    useEffect(() => {
        const closeRequestedListener = listen('close-requested', (e) => {
            const windowUUID = e.payload;

            if((appWindowInfo && appWindowInfo.window_uuid === windowUUID) || windowUUID === "*")
                onCloseCaught(onManualSaveCallback);
        });

        return () => {
            closeRequestedListener.then((res) => { res(); })
        };
    }, [appWindowInfo]);


}

export default useCatchAppClose;