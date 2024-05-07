import { useMemo } from "react";
import { Cue, Trigger, UUID } from "../../Project/Project";
import { AudioPlayerManager } from "../AudioPlayer/Audio";
import { useFormattedTimestamp } from "../Hooks/useFormattedDuration";
import HiddenInputComponent from "../HiddenInputComponent/HiddenInputComponent";

const convertFormattedToTimecode = (formatted: string) => {

    const parts = formatted.split(":");

    if(parts.length != 2) {
        console.error("Can not convert parts of length != 2");
        return;
    }

    const minutes = parts[0];

    let [seconds, milliseconds] = parts[1].split(".");

    while(milliseconds.length < 3) {
        milliseconds += "0";
    }

    return (+minutes * 60) + +seconds + (+milliseconds / 1000);

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

                let isValid = true;

                let parts = value.split(":");

                if(parts.length != 2)
                    return false;

                let secondParts = parts[1].split(".");

                parts.splice(1, 1);
                parts.push(secondParts[0], secondParts[1]);

                for(let i = 0; i < parts.length; i++) {
                    const part = parts[i];

                    if(!Number.isInteger(+part)) {
                        isValid = false;
                        break;
                    } else {
                        const partNum: number = +part;

                        const max = i == 2 ? 999 : 59;

                        if(partNum > max || partNum < 0) {
                            isValid = false;
                            break;
                        }
                    }

                }

                return isValid;

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

                <p>{props.formattedPlayhead}</p>

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