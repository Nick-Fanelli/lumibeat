import { Signal } from "@preact/signals-react";
import AppState from "../AppState";
import Project, { UUID } from "../../Project/Project";
import useSignalSubscribe from "../Hooks/useSignalSubscribe";


const useGetSelectedCue = (selectedCues: Signal<UUID[]>, cue: Signal<Project.Cue | undefined>) => {

    // Handle a change of the selected cues
    useSignalSubscribe(selectedCues, (selectedCues: UUID[]) => {

        if(selectedCues.length !== 1)
            cue.value = undefined;

        if(cue.value !== undefined && cue.value.uuid === selectedCues[0])
            return;

        cue.value = Project.getCueByUUID(AppState.cues.value, selectedCues[0]);
    
    });

    // Handle a change of the cue list on the cue
    useSignalSubscribe(AppState.cues, (cueList: Project.Cue[]) => {

        if(cue.value == undefined)
            return;

        const targetUUID = cue.value.uuid;
        const targetCue = Project.getCueByUUID(cueList, targetUUID);

        if(targetCue !== cue.value)
            cue.value = targetCue;

    });

    return cue;

}

export default useGetSelectedCue;