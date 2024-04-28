import { useSelector } from 'react-redux';
import './Properties.css'
import { RootState } from '../State/AppStore';
import usePropertiesCue from './usePropertiesCue';
import CueProperties from './CueProperties';
import { AudioPlayer, AudioPlayerManager } from '../AudioPlayer/Audio';

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

        // Stop the current audio from the cue
        if(cue.audioSourceFile)
            AudioPlayerManager.stop(cue.audioSourceFile);

        setCue({ ...cue, audioSourceFile: audioFilepath });

        AudioPlayerManager.requestDestroyPlayer(audioFilepath); // Delete currently reported audio player
        new AudioPlayer(audioFilepath); // Pre-Generate Audio Player

    }

    return (

        <section id="audio-visualizer">

            {
                <>
                    <CueProperties cue={cue} setCueAudioFile={setCueAudioFile} />
                </>
            }

            {
                // audioPlayer == null || <Visualizer audioPlayer={audioPlayer} triggers={triggers} playhead={playhead} />
            }

        </section>

    );
};

export default Properties;
