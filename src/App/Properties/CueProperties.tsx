import { signal } from "@preact/signals-react";
import Project from "../../Project/Project";
import SelectAudioFile from "./SelectAudioFile";

type Props = {

    cue: Project.Cue

}

enum ActiveVisualizerTab {

    AUDIO,
    TIMING

}

const activeVisualizerTab = signal<ActiveVisualizerTab>(ActiveVisualizerTab.AUDIO);

const CueProperties = (props: Props) => {

    return (
        <div className="controls">
            
            <div className="tab-bar">

                <div 
                    className={`tab ${activeVisualizerTab.value == ActiveVisualizerTab.AUDIO ? 'selected' : ''}`}
                    onClick={() => { activeVisualizerTab.value = ActiveVisualizerTab.AUDIO; }}
                >
                    <h1>Audio</h1>
                </div>

                <div 
                    className={`tab ${activeVisualizerTab.value == ActiveVisualizerTab.TIMING ? 'selected' : ''}`}
                    onClick={() => { activeVisualizerTab.value = ActiveVisualizerTab.TIMING; }}
                >
                    <h1>Timing</h1>
                </div>

            </div>

            <div className="content">
                
                <div className={`audio ${activeVisualizerTab.value != ActiveVisualizerTab.AUDIO ? 'hidden' : ''}`}>

                    <SelectAudioFile cue={props.cue} />

                </div>

                <div className={`timing ${activeVisualizerTab.value != ActiveVisualizerTab.TIMING ? 'hidden' : ''}`}>
                    
                    <h1>TO BE IMPLEMENTED (TIMING)</h1>

                </div>

            </div>

        </div>
    )
};

export default CueProperties;