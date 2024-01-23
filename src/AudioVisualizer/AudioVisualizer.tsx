import { useEffect, useMemo, useRef, useState } from 'react';
import './AudioVisualizer.css';

import { useWavesurfer } from '@wavesurfer/react'
import { convertFileSrc } from '@tauri-apps/api/tauri';

import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.js';
import RegionsPlugin, { Region } from 'wavesurfer.js/dist/plugins/regions.js';
import HoverPlugin from 'wavesurfer.js/dist/plugins/hover.js';

const formatTime = (seconds: number) => [seconds / 60, seconds % 60, (seconds % 1) * 1000].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':');

const audioFilepath = convertFileSrc("/Users/nickfanelli/Downloads/spotifydown.com - American Ride.mp3");

const AudioVisualizer = () => {

    const [duration, setDuration] = useState<string>("");
    const [activeRegion, setActiveRegion] = useState<Region | undefined>(undefined);

    const regionsPluginRef = useRef<RegionsPlugin>(RegionsPlugin.create());

    const visualizerRef = useRef<HTMLDivElement>(null);

    const { wavesurfer, currentTime  } = useWavesurfer({
        url: audioFilepath,
        container: visualizerRef,
        waveColor: "#326ca9",
        progressColor: "#2d4151",
        minPxPerSec: 0,
        fillParent: true,
        autoScroll: true,
        dragToSeek: true,
        autoCenter: true,
        height: 100,
        plugins: useMemo(() => [
            TimelinePlugin.create(), 
            ZoomPlugin.create({ 
                scale: 0.5, 
                maxZoom: 200,
            }),
            HoverPlugin.create(),
            regionsPluginRef.current,
        ], [])
    });

    const newTrigger = (timecode: number) => {
        
        regionsPluginRef.current.addRegion({
            start: timecode,
        })

    }

    wavesurfer?.on('decode', (duration: number) => {
        setDuration(formatTime(duration));
    });

    useEffect(() => {

        const unsubscribeHandles: (() => void)[] = [];

        unsubscribeHandles.push(
            regionsPluginRef.current.on('region-clicked', (region: Region) => {

                // region.color = "#0000ff";

                // setActiveRegion((prev) => {

                //     if(prev)
                //         prev.color = "#c78f00";

                //     region.color = "red";

                //     return region;

                // });

                // console.log(region);
                // console.log('Region Clicked')
            })
        );

        unsubscribeHandles.push(
            regionsPluginRef.current.on('region-created', (region) => {
                region.on('play', () => {
                    console.log("HEY");
                })
            })
        );

        unsubscribeHandles.push(
            regionsPluginRef.current.on('region-removed', () => {
                console.log('Region Removed')
            })
        );

        return () => {
            unsubscribeHandles.forEach((handle) => { handle(); });
            unsubscribeHandles.length = 0;

            // visualizerRef.current?.removeEventListener('mousedown', deselectRegion);
        }

    }, [regionsPluginRef.current, setActiveRegion]);

    return (
        <section id="audio-visualizer">
            <div id="waveform-container">
                <div id="waveform" ref={visualizerRef}></div>
            </div>

            <div id="stats">
                <div className="time">
                    <h1>{formatTime(currentTime)}</h1>
                    <h1>{duration}</h1>
                    <h1>{activeRegion && activeRegion.start}</h1>
                </div>
                <button id="add-trigger" onClick={() => newTrigger(currentTime)}>New Trigger</button>
            </div>
        </section>
    )

};

export default AudioVisualizer;
