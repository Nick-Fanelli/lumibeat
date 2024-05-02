import { useSelector } from 'react-redux';
import './Properties.css'
import { RootState } from '../State/AppStore';
import usePropertiesCue from './usePropertiesCue';
import CueProperties from './CueProperties';
import { AudioPlayer, AudioPlayerManager } from '../AudioPlayer/Audio';
import Visualizer from './Visualizer';
import Trigger from './Trigger';
import { useGetCueAudioPlayer } from '../Hooks/useGetCueAudioPlayer';

const Properties = () => {

    const selectedCues = useSelector((state: RootState) => state.selectedCues.value);
    const [ cue, setCue ] = usePropertiesCue(selectedCues);

    const { audioPlayer, playhead, duration, triggers } = useGetCueAudioPlayer(cue);
    
    if(cue == undefined)
        return null;


    const setCueAudioFile = async (audioFilepath: string) => {

        setCue({ ...cue, audioSourceFile: audioFilepath });

        AudioPlayerManager.requestDestroyPlayer(cue.uuid); // Delete currently reported audio player
        new AudioPlayer(cue.uuid, audioFilepath); // Pre-Generate Audio Player

    }

    const addCueTrigger = async (timestamp: number) => {

        let triggers: Trigger[] = [];

        if(cue.triggers)
            triggers = [ ...cue.triggers ];

        triggers.push({ timestamp });

        setCue({ ...cue, triggers: triggers });

    }

    return (

        <section id="audio-visualizer">

            {
                <>
                    <CueProperties cue={cue} setCueAudioFile={setCueAudioFile} addCueTrigger={addCueTrigger} triggers={triggers} />
                </>
            }

            <Visualizer cue={cue} audioPlayer={audioPlayer} duration={duration} triggers={triggers} playhead={playhead} />

        </section>

    );
};

export default Properties;
