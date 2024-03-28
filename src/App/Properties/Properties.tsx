import './Properties.css'

// const formatTime = (seconds: number) => [seconds / 60, seconds % 60, (seconds % 1) * 1000].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':');

const Properties = () => {

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

    return null;

    // return (

    //     <section id="audio-visualizer">

    //         <button onClick={() => {
    //             if(cue.value == undefined)
    //                 return;

    //             let anotherCue = cue.value;
    //             anotherCue.name = "HEY";
    //             cue.value = anotherCue;
                
    //         }}>
    //             RENAME CUE
    //         </button>

    //         {cue.value.name}

    //         {/* <h1>{cue?.name}</h1> */}

    //         {
    //             <>
    //                 {/* <CueProperties cue={cue} /> */}
    //             </>
    //         }


    //         {
    //             // audioPlayer == null || <Visualizer audioPlayer={audioPlayer} triggers={triggers} playhead={playhead} />
    //         }

    //     </section>

    // );
};

export default Properties;
