import { useCallback, useEffect, useRef, useState } from 'react';
// import { convertFileSrc } from '@tauri-apps/api/tauri';

import './AudioVisualizer.css'
import { AudioPlayer } from '../AudioPlayer/AudioPlayer';
import { signal } from '@preact/signals-react';

type VisualizerProps = {

    audioPlayer: AudioPlayer,
    triggers: Trigger[]

}

// const formatTime = (seconds: number) => [seconds / 60, seconds % 60, (seconds % 1) * 1000].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':');

const Visualizer = (props: VisualizerProps) => {

    const visualizerRef = useRef<HTMLDivElement>(null);

    const [playhead, setPlayhead] = useState<number>(0);

    // const formattedDuration = useMemo(() => formatTime(props.audioPlayer.getDuration()), [props.audioPlayer]);

    const onVisualizerClick = useCallback((x: number) => {

        const relativeClickPosition = x / visualizerRef.current!.offsetWidth;
        const newPlayheadPosition = relativeClickPosition * props.audioPlayer.getDuration();
        const clampedPlayheadPosition = Math.min(Math.max(newPlayheadPosition, 0), props.audioPlayer.getDuration());

        props.audioPlayer.seekTo(clampedPlayheadPosition);

    }, [props.audioPlayer, visualizerRef.current]);

    useEffect(() => {

        const playbackRefreshInterval = setInterval(() => {
            setPlayhead(props.audioPlayer.getCurrentTime());
        }, 10);

        const handleMouseUp = (e: MouseEvent) => {
            
            let value = e.clientX - visualizerRef.current!.offsetLeft;
            value = Math.max(0, Math.min(value, visualizerRef.current!.offsetWidth))
            
            onVisualizerClick(value);

            document?.removeEventListener('mousemove', handleMouseMove);
            document?.removeEventListener('mouseup', handleMouseUp);

        }

        const handleMouseMove = (e: MouseEvent) => {

            let value = e.clientX - visualizerRef.current!.offsetLeft;
            value = Math.max(0, Math.min(value, visualizerRef.current!.offsetWidth))

            onVisualizerClick(value);

        }

        const handleOnMouseDown = (e: MouseEvent) => {

            let value = e.clientX - visualizerRef.current!.offsetLeft;
            value = Math.max(0, Math.min(value, visualizerRef.current!.offsetWidth))

            onVisualizerClick(value);

            document?.addEventListener('mousemove', handleMouseMove);
            document?.addEventListener('mouseup', handleMouseUp);

        }

        visualizerRef.current?.addEventListener('mousedown', handleOnMouseDown);

        return () => {

            visualizerRef.current?.removeEventListener('mousedown', handleOnMouseDown);
            document?.removeEventListener('mousemove', handleMouseMove);
            document?.removeEventListener('mouseup', handleMouseUp);

            clearInterval(playbackRefreshInterval);

        }

    }, [visualizerRef.current, onVisualizerClick]);

    return (
        <>
            <section id="visualizer">

                <div className="waveform" ref={visualizerRef}>

                    <div className="midline"></div>

                    {
                        props.triggers.map((trigger, index) => (
                            <div key={index} className='trigger' style={{
                                left: `${(trigger.timestamp / props.audioPlayer.getDuration()) * 100}`
                            }}></div>
                        ))
                    }

                    <div className="playhead" style={{
                        left: `${(playhead / props.audioPlayer.getDuration()) * 100}%`
                    }}></div>

                </div>

            </section>
        </>
    )

}

type Trigger = {

    timestamp: number

}

enum ActiveVisualizerTab {

    AUDIO,
    TIMING

}

const activeVisualizerTab = signal<ActiveVisualizerTab>(ActiveVisualizerTab.AUDIO);

const AudioVisualizer = () => {

    const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);
    const [triggers, setTriggers] = useState<Trigger[]>([]);

    useEffect(() => {

        const loadAudio = async () => {
            const player = await AudioPlayer.createAudioPlayer("/Users/nickfanelli/Documents/DriveBy.mp3");
            setAudioPlayer(player);
        }

        loadAudio();


    }, [setAudioPlayer]);


    const addTriggerAtPlayhead = useCallback(() => {

        if(audioPlayer == null)
            return;

        setTriggers((prev) => {
            return [...prev, { timestamp: audioPlayer.getCurrentTime() }];
        })

    }, [audioPlayer, setTriggers]);

    const playPause = useCallback(() => {

        if(audioPlayer == null)
            return;

        audioPlayer.playPause();

    }, [audioPlayer]);

    return (

        <section id="audio-visualizer">

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
                        <button onClick={() => {
                            playPause();
                        }}>Play Pause</button>

                        <button onClick={() => addTriggerAtPlayhead()}>Add Trigger</button>
                    </div>

                </div>

            </div>

            {
                audioPlayer == null ? 
                <h1>Loading</h1>
                :
                <>
                    {/* <div className="controls">
                        <div id="timestamp">
                            <p>{formatTime(playhead)}</p>
                            <p>/</p>
                            <p>{formattedDuration}</p>
                        </div>
                        <div></div>
                    </div> */}
                    <Visualizer audioPlayer={audioPlayer} triggers={triggers} />
                </>
            }

        </section>

    );
};

export default AudioVisualizer;
