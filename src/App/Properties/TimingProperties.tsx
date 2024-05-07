import { useMemo } from "react";
import { Cue, Trigger, UUID } from "../../Project/Project";
import { AudioPlayerManager } from "../AudioPlayer/Audio";
import { useFormattedTimestamp } from "../Hooks/useFormattedDuration";

type TriggerListElementProps = {

    trigger: Trigger,
    selectedTrigger: UUID | undefined

    setTriggerNetworkCue: (triggerUUID: UUID, networkCueNumber: number | undefined) => void
    setSelectedTrigger: (trigger: UUID | undefined) => void

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
            <p>{formattedDuration}</p>
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

                <button>Delete Trigger</button>
            </div>

            <div className="triggers-scroll">
                <ul id="triggers-list">
                    {
                        props.triggers.map((trigger) => (
                            <TriggerListElement key={trigger.uuid} trigger={trigger} setTriggerNetworkCue={props.setTriggerNetworkCue} selectedTrigger={props.selectedTrigger} setSelectedTrigger={props.setSelectedTrigger} />
                        ))
                    }
                </ul>
            </div>
        </>
    )

}

export default TimingProperties;