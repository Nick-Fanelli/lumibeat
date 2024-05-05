import { Cue } from "../../Project/Project";
import { AudioPlayerManager } from "../AudioPlayer/Audio";
import SelectAudioFile from "./SelectAudioFile";

type Props = {

    cue: Cue
    
    setCueAudioFile: (audioFilePath: string) => void

}

const AudioProperties = (props: Props) => {

    return (
        <>
            <button onClick={() => {
                if(props.cue.audioSourceFile)
                    AudioPlayerManager.play(props.cue.uuid);
            }}>Play</button>


            <SelectAudioFile cue={props.cue} audioFilepath={props.cue.audioSourceFile} setAudioFilepath={props.setCueAudioFile} />
        </>
    )

}

export default AudioProperties;