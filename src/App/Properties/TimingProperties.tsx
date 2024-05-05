import { useMemo } from "react";
import { Cue, Trigger, UUID } from "../../Project/Project";
import { AudioPlayerManager } from "../AudioPlayer/Audio";
import { useFormattedTimestamp } from "../Hooks/useFormattedDuration";

type TriggerListElementProps = {

    trigger: Trigger,
    setTriggerNetworkCue: (triggerUUID: UUID, networkCueNumber: number | undefined) => void

}

const useGetTriggerListElementState = (trigger: Trigger) : string => {

    return useMemo<string>(() => {
        let state = "";

        if(!trigger.networkCue)
            state = "error-state";
    
        return state;
    }, [trigger]);

}

const TriggerListElement = (props: TriggerListElementProps) => {

    const formattedDuration = useFormattedTimestamp(props.trigger.timestamp);
    const state = useGetTriggerListElementState(props.trigger);

    return (
        <li className={state}>
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

    formattedPlayhead: string

    addCueTrigger: (timestamp: number) => void
    setTriggerNetworkCue: (triggerUUID: UUID, networkCueNumber: number | undefined) => void

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
                            <TriggerListElement key={trigger.uuid} trigger={trigger} setTriggerNetworkCue={props.setTriggerNetworkCue} />
                        ))
                    }
                </ul>
            </div>
        </>
    )

}

export default TimingProperties;