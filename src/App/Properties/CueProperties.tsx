import { useState } from "react";
import { Cue, UUID } from "../../Project/Project";
import { Trigger } from "../../Project/Project";
import { useSortTriggers } from "../Hooks/useSortTriggers";
import AudioProperties from "./AudioProperties";
import TimingProperties from "./TimingProperties";

type Props = {

    cue: Cue
    selectedTrigger: UUID | undefined

    setCueAudioFile: (audioFile: string) => void
    setTriggerNetworkCue: (triggerUUID: UUID, networkCueNumber: number | undefined) => void
    addCueTrigger: (timestamp: number) => void
    setSelectedTrigger: (trigger: UUID | undefined) => void
    setTriggerTimestamp: (triggerUUID: UUID, timestamp: number) => void
    deleteTrigger: (triggerUUID: UUID) => void

    formattedPlayhead: string

    triggers: Trigger[]

}

enum ActiveVisualizerTab {

    AUDIO,
    TIMING

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
                    <AudioProperties cue={props.cue} setCueAudioFile={props.setCueAudioFile} />
                </div>

                <div className={`timing ${activeVisualizerTab != ActiveVisualizerTab.TIMING ? 'hidden' : ''}`}>
                    <TimingProperties cue={props.cue} triggers={triggers} formattedPlayhead={props.formattedPlayhead} addCueTrigger={props.addCueTrigger} setTriggerNetworkCue={props.setTriggerNetworkCue} selectedTrigger={props.selectedTrigger} setSelectedTrigger={props.setSelectedTrigger} deleteTrigger={props.deleteTrigger} setTriggerTimestamp={props.setTriggerTimestamp} />
                </div>

            </div>

        </div>
    )
};

export default CueProperties;