import { invoke } from "@tauri-apps/api";
import { confirm } from "@tauri-apps/api/dialog";
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

const onCloseCaught = async (onManualSaveCallback : () => Promise<void>) => {

    const result = await confirm("Are you sure you want to close this show file. Your project is auto-saved...", {
        okLabel: "Close Show File"
    });

    if(result) {
        await onManualSaveCallback();

        invoke('close_window');
    }

}

const useCatchAppClose = (onManualSaveCallback : () => Promise<void>) => {

    useEffect(() => {
        const closeRequestedListener = listen('close-requested', () => {
            onCloseCaught(onManualSaveCallback);
        });

        return () => {
            closeRequestedListener.then((res) => { res(); })
        };
    }, []);


}

export default useCatchAppClose;