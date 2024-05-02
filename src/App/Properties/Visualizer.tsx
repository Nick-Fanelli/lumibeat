import { useCallback, useEffect, useRef } from "react";
import { Cue } from "../../Project/Project";
import { AudioPlayer } from "../AudioPlayer/Audio";
import Trigger from "./Trigger";

type VisualizerProps = {

    cue: Cue,
    audioPlayer: AudioPlayer | undefined
    duration: number
    triggers: Trigger[],
    playhead: number

}

const Visualizer = (props: VisualizerProps) => {

    const visualizerRef = useRef<HTMLDivElement>(null);

    const onVisualizerClick = useCallback((x: number) => {

        if(!props.audioPlayer)
            return;

        const relativeClickPosition = x / visualizerRef.current!.offsetWidth;
        const newPlayheadPosition = relativeClickPosition * props.duration;
        const clampedPlayheadPosition = Math.min(Math.max(newPlayheadPosition, 0), props.duration);

        props.audioPlayer.seekTo(clampedPlayheadPosition);

    }, [ props.audioPlayer, visualizerRef.current]);

    useEffect(() => {

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

        }

    }, [visualizerRef.current, onVisualizerClick]);

    if(!props.audioPlayer)
        return <section id="visualizer"></section>

    return (
        <>
            <section id="visualizer">

                <div className="waveform" ref={visualizerRef}>

                    <div className="midline"></div>
                
                    {
                        props.triggers.map((trigger, index) => (
                            <div key={index} className='trigger' style={{
                                left: `${(trigger.timestamp / props.duration) * 100}%`
                            }}></div>
                        ))
                    }

                    <div className="playhead" style={{
                        left: `${(props.playhead / props.duration) * 100}%`
                    }}></div>

                </div>

            </section>
        </>
    )

}

export default Visualizer;