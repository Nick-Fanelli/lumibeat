import React, { lazy, useCallback, useEffect, useRef, useState } from 'react';
// import { convertFileSrc } from '@tauri-apps/api/tauri';

import './AudioVisualizer.css'
import { AudioPlayer, AudioSource } from '../AudioPlayer/AudioPlayer';

type VisualizerProps = {

    audioPlayer: AudioPlayer

}

const formatTime = (seconds: number) => [seconds / 60, seconds % 60, (seconds % 1) * 1000].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':');

const Visualizer = (props: VisualizerProps) => {

    const visualizerRef = useRef<HTMLDivElement>(null);

    const [playhead, setPlayhead] = useState<number>(0);

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

            onVisualizerClick(e.offsetX);

            visualizerRef.current?.removeEventListener('mousemove', handleMouseMove);
            visualizerRef.current?.removeEventListener('mousemove', handleMouseUp);

        }

        const handleMouseMove = (e: MouseEvent) => {

            onVisualizerClick(e.offsetX);

        }

        const handleOnMouseDown = (e: MouseEvent) => {

            onVisualizerClick(e.offsetX);

            visualizerRef.current?.addEventListener('mousemove', handleMouseMove);
            visualizerRef.current?.addEventListener('mouseup', handleMouseUp);

        }

        visualizerRef.current?.addEventListener('mousedown', handleOnMouseDown);

        return () => {

            visualizerRef.current?.removeEventListener('mousedown', handleOnMouseDown);
            visualizerRef.current?.removeEventListener('mousemove', handleMouseMove);
            visualizerRef.current?.removeEventListener('mousemove', handleMouseUp);

            clearInterval(playbackRefreshInterval);

        }

    }, [visualizerRef.current, onVisualizerClick]);

    return (
        <>
            <section id="visualizer">

                <div className="waveform" ref={visualizerRef}>

                    <div className="playhead" style={{
                        left: `${(playhead / props.audioPlayer.getDuration()) * 100}%`
                    }}></div>

                    <div className="midline"></div>

                </div>

                <div className="controls">
                    <p>{formatTime(playhead)}</p>
                </div>

            </section>
        </>
    )

}

const AudioVisualizer = () => {

    const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);

    useEffect(() => {

        console.log("New Audio Player");

        const loadAudio = async () => {
            const player = await AudioPlayer.createAudioPlayer("/Users/nickfanelli/Documents/DriveBy.mp3");
            setAudioPlayer(player);
        }

        loadAudio();


    }, [setAudioPlayer]);

    const playPause = useCallback(() => {

        if(audioPlayer == null)
            return;

        audioPlayer.playPause();

    }, [audioPlayer]);

    return (

        <section id="audio-visualizer">

            <div className="controls">
                <button onClick={() => {
                    playPause();
                }}>Play Pause</button>
            </div>

            {
                audioPlayer == null ? 
                <h1>Loading</h1>
                :
                <>
                    <Visualizer audioPlayer={audioPlayer} />
                </>
            }

        </section>

    );
};

export default AudioVisualizer;
