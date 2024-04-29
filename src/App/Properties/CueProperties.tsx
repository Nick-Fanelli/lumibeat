import { useState } from "react";
import SelectAudioFile from "./SelectAudioFile";
import { Cue } from "../../Project/Project";
import { AudioPlayerManager } from "../AudioPlayer/Audio";

type Props = {

    cue: Cue
    setCueAudioFile: (audioFile: string) => void
    addCueTrigger: (timestamp: number) => void

}

enum ActiveVisualizerTab {

    AUDIO,
    TIMING

}

const CueProperties = (props: Props) => {

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

                    <button onClick={() => {

                        const timestamp = AudioPlayerManager.getTimestamp(props.cue.uuid);

                        if(timestamp)
                            props.addCueTrigger(timestamp);

                    }}>Add Trigger</button>

                </div>

            </div>

        </div>
    )
};

export default CueProperties;