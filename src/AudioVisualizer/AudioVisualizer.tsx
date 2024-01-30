import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { convertFileSrc } from '@tauri-apps/api/tauri';

// const audioFilepath = convertFileSrc("/Users/nickfanelli/Downloads/spotifydown.com - American Ride.mp3");

import './AudioVisualizer.css'

type VisualizerProps = {

    duration: number

}

const Visualizer = (props: VisualizerProps) => {

    const visualizerRef = useRef<HTMLDivElement>(null);

    const [playhead, setPlayhead] = useState<number>(0);


    const onVisualizerClick = useCallback((x: number) => {

        const relativeClickPosition = x / visualizerRef.current!.offsetWidth;
        const newPlayheadPosition = relativeClickPosition * props.duration;
        const clampedPlayheadPosition = Math.min(Math.max(newPlayheadPosition, 0), props.duration);

        setPlayhead(clampedPlayheadPosition);

    }, [setPlayhead, visualizerRef.current]);

    useEffect(() => {

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
            
        }

    }, [visualizerRef.current, onVisualizerClick]);

    return (
        <>
            <section id="visualizer">

                <div className="waveform" ref={visualizerRef}>

                    <div className="playhead" style={{
                        left: `${(playhead / props.duration) * 100}%`
                    }}></div>

                </div>

                <div className="controls">
                    <input type="range" name="" id="" min={0} max={props.duration} value={playhead} onChange={(e) => setPlayhead(+e.target.value)} />
                    <p>{playhead}</p>
                </div>

            </section>
        </>
    )

}

const AudioVisualizer = () => {

    return (
    
        <section id="audio-visualizer">

            <div className="controls">

            </div>

            <Visualizer duration={120} />

        </section>
    
    );
};

export default AudioVisualizer;
