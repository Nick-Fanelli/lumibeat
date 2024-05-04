import { useState } from "react";
import SelectAudioFile from "./SelectAudioFile";
import { Cue } from "../../Project/Project";
import { AudioPlayerManager } from "../AudioPlayer/Audio";
import Trigger from "./Trigger";
import { useFormattedTimestamp } from "../Hooks/useFormattedDuration";
import { useSortTriggers } from "../Hooks/useSortTriggers";

type Props = {

    cue: Cue
    setCueAudioFile: (audioFile: string) => void
    addCueTrigger: (timestamp: number) => void
    formattedPlayhead: string

    triggers: Trigger[]

}

enum ActiveVisualizerTab {

    AUDIO,
    TIMING

}

type TriggerListElementProps = {

    trigger: Trigger

}

const TriggerListElement = (props: TriggerListElementProps) => {

    const formattedDuration = useFormattedTimestamp(props.trigger.timestamp);

    return (
        <li>
            <p>{formattedDuration}</p>
            <div>
                <p>EOS Cue #</p>
                <input type="number" name="Cue Number to Fire" id="" />
            </div>
        </li>
    )

}

const CueProperties = (props: Props) => {

    const triggers = useSortTriggers(props.triggers);

    const [activeVisualizerTab, setActiveVisualizerTab] = useState<ActiveVisualizerTab>(ActiveVisualizerTab.AUDIO);

    return (
        <div className="controls">
            
            <div className="tab-bar">

                <div 
                    className={`tab ${activeVisualizerTab == ActiveVisualizerTab.AUDIO ? 'selected' : ''}`}
                    onClick={() => { setActiveVisualizerTab(ActiveVisualizerTab.AUDIO); }}
                >
                    <h1>Audio</h1>
                </div>

                <div 
                    className={`tab ${activeVisualizerTab == ActiveVisualizerTab.TIMING ? 'selected' : ''}`}
                    onClick={() => { setActiveVisualizerTab(ActiveVisualizerTab.TIMING); }}
                >
                    <h1>Timing</h1>
                </div>

            </div>

            <div className="content">
                
                <div className={`audio ${activeVisualizerTab != ActiveVisualizerTab.AUDIO ? 'hidden' : ''}`}>

                    <button onClick={() => {
                        if(props.cue.audioSourceFile)
                            AudioPlayerManager.play(props.cue.uuid);
                    }}>Play</button>


                    <SelectAudioFile cue={props.cue} audioFilepath={props.cue.audioSourceFile} setAudioFilepath={props.setCueAudioFile} />

                </div>

                <div className={`timing ${activeVisualizerTab != ActiveVisualizerTab.TIMING ? 'hidden' : ''}`}>

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
                                triggers.map((trigger, index) => (
                                    <TriggerListElement key={"trigger-" + index} trigger={trigger} />
                                ))
                            }
                        </ul>
                    </div>
                    
                </div>

            </div>

        </div>
    )
};

export default CueProperties;