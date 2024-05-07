import { useSelector } from 'react-redux';
import './Properties.css'
import { AppState } from '../State/AppStore';
import usePropertiesCue from './usePropertiesCue';
import CueProperties from './CueProperties';
import { AudioPlayer, AudioPlayerManager } from '../AudioPlayer/Audio';
import Visualizer from './Visualizer';
import { TriggerUtils, UUID } from '../../Project/Project';
import { useGetCueAudioPlayer } from '../Hooks/useGetCueAudioPlayer';
import { useState } from 'react';

const Properties = () => {

    const [ selectedTrigger, setSelectedTrigger ] = useState<UUID | undefined>(undefined);

    const selectedCues = useSelector((state: AppState) => state.selectedCues.value);
    const [ cue, setCue ] = usePropertiesCue(selectedCues);

    const { audioPlayer, playhead, formattedPlayhead, duration, triggers } = useGetCueAudioPlayer(cue);
    
    if(cue == undefined)
        return null;

    const setCueAudioFile = async (audioFilepath: string) => {

        setCue({ ...cue, audioSourceFile: audioFilepath });

        AudioPlayerManager.requestDestroyPlayer(cue.uuid); // Delete currently reported audio player
        new AudioPlayer(cue.uuid, audioFilepath); // Pre-Generate Audio Player

    }

    const addCueTrigger = async (timestamp: number) => {

        const triggers = TriggerUtils.createTrigger(cue.triggers, timestamp);
        setCue({ ...cue, triggers: triggers });

    }

    const setTriggerNetworkCue = async (triggerUUID: UUID, networkCueNumber: number | undefined) => {
        
        const triggers = TriggerUtils.setTriggerNetworkCue(cue.triggers, triggerUUID, networkCueNumber);
        setCue({ ...cue, triggers: triggers });

    }

    const setTriggerTimestamp = async (triggerUUID: UUID, timestamp: number) => {

        const triggers = TriggerUtils.setTriggerTimestamp(cue.triggers, triggerUUID, timestamp);
        setCue({ ...cue, triggers: triggers });

    }

    const deleteTrigger = async (triggerUUID: UUID) => {

        const triggers = TriggerUtils.deleteTrigger(cue.triggers, triggerUUID);
        setCue({ ...cue, triggers: triggers });

    }

    return (

        <section id="audio-visualizer">

            {
                <>
                    <CueProperties cue={cue} setCueAudioFile={setCueAudioFile} addCueTrigger={addCueTrigger} triggers={triggers} formattedPlayhead={formattedPlayhead} setTriggerNetworkCue={setTriggerNetworkCue} selectedTrigger={selectedTrigger} setSelectedTrigger={setSelectedTrigger} deleteTrigger={deleteTrigger} setTriggerTimestamp={setTriggerTimestamp} />
                </>
            }

            <Visualizer cue={cue} audioPlayer={audioPlayer} duration={duration} triggers={triggers} playhead={playhead} selectedTrigger={selectedTrigger} />

        </section>

    );
};

export default Properties;
