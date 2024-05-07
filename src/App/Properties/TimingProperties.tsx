import { useMemo } from "react";
import { Cue, Trigger, UUID } from "../../Project/Project";
import { AudioPlayerManager } from "../AudioPlayer/Audio";
import { useFormattedTimestamp } from "../Hooks/useFormattedDuration";
import HiddenInputComponent from "../HiddenInputComponent/HiddenInputComponent";

const convertFormattedToTimecode = (formatted: string) : number => {

    const parts = formatted.split(":");

    if(parts.length == 1) {
        return +parts[0];
    } else if(parts.length == 2) {
        return (+parts[0] * 60) + (+parts[1]);
    } else {
        console.error("Invalid parts");
        return -1;
    }

}

type TriggerListElementProps = {

    trigger: Trigger,
    selectedTrigger: UUID | undefined

    setTriggerNetworkCue: (triggerUUID: UUID, networkCueNumber: number | undefined) => void
    setSelectedTrigger: (trigger: UUID | undefined) => void
    setTriggerTimestamp: (triggerUUID: UUID, timestamp: number) => void

}

const useGetTriggerListElementState = (trigger: Trigger, selectedTrigger: UUID | undefined) : string => {

    return useMemo<string>(() => {
        let state = "";

        if(!trigger.networkCue)
            state += "error-state ";

        if(trigger.uuid === selectedTrigger)
            state += "selected ";
    
        return state;
    }, [trigger, selectedTrigger]);

}

const TriggerListElement = (props: TriggerListElementProps) => {

    const formattedDuration = useFormattedTimestamp(props.trigger.timestamp);
    const state = useGetTriggerListElementState(props.trigger, props.selectedTrigger);

    return (
        <li className={state} onClick={() => {
            props.setSelectedTrigger(props.trigger.uuid)
        }}>
            <HiddenInputComponent value={formattedDuration} customValidation={(value: string) => {
                const regex = /([0-5][0-9]:)?([0-5][0-9]?(\.\d{1,3})?)/;
                return regex.test(value);

            }} setValue={(value: string) => {
                const timestamp = convertFormattedToTimecode(value);

                if(timestamp)
                    props.setTriggerTimestamp(props.trigger.uuid, timestamp);

            }} />
            <div>
                <p>EOS Cue #</p>
                <input type="number" name="Network Cue to Fire" id="network-cue" defaultValue={props.trigger.networkCue} onChange={(e) => {

                    const value: string = e.currentTarget.value;

                    if(value.trim().length == 0) {
                        props.setTriggerNetworkCue(props.trigger.uuid, undefined);
                        return;
                    }

                    const numericalValue: number = +value;
                    props.setTriggerNetworkCue(props.trigger.uuid, numericalValue);

                }} />
            </div>
        </li>
    )

}

type Props = {

    cue: Cue
    triggers: Trigger[]
    selectedTrigger: UUID | undefined

    formattedPlayhead: string

    addCueTrigger: (timestamp: number) => void
    setTriggerNetworkCue: (triggerUUID: UUID, networkCueNumber: number | undefined) => void
    setSelectedTrigger: (trigger: UUID | undefined) => void
    deleteTrigger: (triggerUUID: UUID) => void
    setTriggerTimestamp: (triggerUUID: UUID, timestamp: number) => void

}

const TimingProperties = (props: Props) => {

    return (
        <>
            <div className="controls">
                <button onClick={() => {

                    const timestamp = AudioPlayerManager.getTimestamp(props.cue.uuid);

                    if(timestamp)
                        props.addCueTrigger(timestamp);

                }}>Add Trigger</button>

                <p onDoubleClick={() => {
                    if(props.selectedTrigger)
                        props.setTriggerTimestamp(props.selectedTrigger, convertFormattedToTimecode(props.formattedPlayhead));
                }} style={{ cursor: "pointer" }}>{props.formattedPlayhead}</p>

                <button onClick={() => {
                    if(props.selectedTrigger !== undefined)
                        props.deleteTrigger(props.selectedTrigger);
                }}>Delete Trigger</button>
            </div>

            <div className="triggers-scroll">
                <ul id="triggers-list">
                    {
                        props.triggers.map((trigger) => (
                            <TriggerListElement key={trigger.uuid} trigger={trigger} setTriggerNetworkCue={props.setTriggerNetworkCue} selectedTrigger={props.selectedTrigger} setSelectedTrigger={props.setSelectedTrigger} setTriggerTimestamp={props.setTriggerTimestamp} />
                        ))
                    }
                </ul>
            </div>
        </>
    )

}

export default TimingProperties;