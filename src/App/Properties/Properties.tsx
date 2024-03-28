import './Properties.css'
import { Signal, signal } from '@preact/signals-react';
import Project, { UUID } from '../../Project/Project';
import AppState from '../AppState';
import useGetSelectedCue from './useGetSelectedCue';
import useSignalSubscribe from '../Hooks/useSignalSubscribe';

// const formatTime = (seconds: number) => [seconds / 60, seconds % 60, (seconds % 1) * 1000].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':');

type PropertiesProps = {

    selectedCues: Signal<UUID[]>

}

const playhead = signal<number>(0);

const cue = signal<Project.Cue | undefined>(undefined);

const Properties = (props: PropertiesProps) => {

    cue.value;

    useGetSelectedCue(props.selectedCues, cue);

     // Handle a change of the local native cue to update the cue list
     useSignalSubscribe(cue, (cue: Project.Cue | undefined) => {

        // if(cue == undefined)
        //     return;

        // const targetUUID = cue.uuid;
        // const targetCue = Project.getCueByUUID(AppState.cues.value, targetUUID);

        // if(targetCue !== cue) {
        //     AppState.redefineCue(targetUUID, cue);
        // }

    });

    // if(props.selectedCue == undefined)
    //     return null;

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

    if(cue.value == undefined)
        return null;

    return (

        <section id="audio-visualizer">

            <button onClick={() => {
                if(cue.value == undefined)
                    return;

                let anotherCue = cue.value;
                anotherCue.name = "HEY";
                cue.value = anotherCue;
                
            }}>
                RENAME CUE
            </button>

            {cue.value.name}

            {/* <h1>{cue?.name}</h1> */}

            {
                <>
                    {/* <CueProperties cue={cue} /> */}
                </>
            }


            {
                // audioPlayer == null || <Visualizer audioPlayer={audioPlayer} triggers={triggers} playhead={playhead} />
            }

        </section>

    );
};

export default Properties;
