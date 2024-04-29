import { useSelector } from 'react-redux';
import './Properties.css'
import { RootState } from '../State/AppStore';
import usePropertiesCue from './usePropertiesCue';
import CueProperties from './CueProperties';
import { AudioPlayer, AudioPlayerManager } from '../AudioPlayer/Audio';
import Visualizer from './Visualizer';
import Trigger from './Trigger';

// const formatTime = (seconds: number) => [seconds / 60, seconds % 60, (seconds % 1) * 1000].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':');

const Properties = () => {

    const selectedCues = useSelector((state: RootState) => state.selectedCues.value);
    const [ cue, setCue ] = usePropertiesCue(selectedCues);

    if(cue == undefined)
        return null;

    // const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);
    // const [triggers, setTriggers] = useState<Trigger[]>([]);

    // useEffect(() => {

    //     const loadAudio = async () => {
    //         const player = await AudioPlayer.createAudioPlayer("/Users/nickfanelli/Documents/DriveBy.mp3");
    //         setAudioPlayer(player);
    //     }

    //     loadAudio();


    // }, [setAudioPlayer]);

    // const addTriggerAtPlayhead = useCallback(() => {

    //     if(audioPlayer == null)
    //         return;

    //     setTriggers((prev) => {
    //         return [...prev, { timestamp: audioPlayer.getCurrentTime() }];
    //     })

    // }, [audioPlayer, setTriggers]);

    // const playPause = useCallback(() => {

    //     if(audioPlayer == null)
    //         return;

    //     audioPlayer.playPause();

    // }, [audioPlayer]);

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
                    <CueProperties cue={cue} setCueAudioFile={setCueAudioFile} addCueTrigger={addCueTrigger} />
                </>
            }

            <Visualizer cue={cue}  />

        </section>

    );
};

export default Properties;
