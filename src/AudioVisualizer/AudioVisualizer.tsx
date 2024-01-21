import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './AudioVisualizer.css';

import { useWavesurfer } from '@wavesurfer/react'
import { convertFileSrc } from '@tauri-apps/api/tauri';

import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';

const audioFilepath = convertFileSrc("/Users/nickfanelli/Downloads/spotifydown.com - American Ride.mp3");

const AudioVisualizer = () => {

    const visualizerRef = useRef<HTMLDivElement>(null);

    const { wavesurfer, currentTime } = useWavesurfer({
        container: visualizerRef,
        url: audioFilepath,
        waveColor: "#326ca9",
        progressColor: "#2d4151",
        minPxPerSec: 0,
        fillParent: true,
        autoScroll: true,
        dragToSeek: true,
        hideScrollbar: true,
        plugins: useMemo(() => [
            TimelinePlugin.create(), 
            ZoomPlugin.create({ 
                scale: 0.5, 
                maxZoom: 200,
            }),
            RegionsPlugin.create()
        ], [])
    });

    const onPlayPause = useCallback(() => {
        wavesurfer && wavesurfer.playPause();
    }, [wavesurfer]);

    return (
        <section id="audio-visualizer">
            <div id="waveform-container">
                <div id="waveform" ref={visualizerRef}></div>
            </div>

            <div id="stats">
                <h1>{currentTime}</h1>
            </div>
            <button onClick={onPlayPause}>Play & Pause</button>
        </section>
    )

};

export default AudioVisualizer;
