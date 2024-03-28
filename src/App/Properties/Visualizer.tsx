import { useCallback, useEffect, useRef } from "react";
import { AudioPlayer } from "../AudioPlayer/AudioPlayer";
import Trigger from "./Trigger";
import { Signal } from "@preact/signals-react";

type VisualizerProps = {

    audioPlayer: AudioPlayer,
    triggers: Trigger[],
    playhead: Signal<number>

}

const Visualizer = (props: VisualizerProps) => {

    const visualizerRef = useRef<HTMLDivElement>(null);

    // const formattedDuration = useMemo(() => formatTime(props.audioPlayer.getDuration()), [props.audioPlayer]);

    const onVisualizerClick = useCallback((x: number) => {

        const relativeClickPosition = x / visualizerRef.current!.offsetWidth;
        const newPlayheadPosition = relativeClickPosition * props.audioPlayer.getDuration();
        const clampedPlayheadPosition = Math.min(Math.max(newPlayheadPosition, 0), props.audioPlayer.getDuration());

        props.audioPlayer.seekTo(clampedPlayheadPosition);

    }, [props.audioPlayer, visualizerRef.current]);

    useEffect(() => {

        const playbackRefreshInterval = setInterval(() => {
            props.playhead.value = props.audioPlayer.getCurrentTime();
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
                                left: `${(trigger.timestamp / props.audioPlayer.getDuration()) * 100}%`
                            }}></div>
                        ))
                    }

                    <div className="playhead" style={{
                        left: `${(props.playhead.value / props.audioPlayer.getDuration()) * 100}%`
                    }}></div>

                </div>

            </section>
        </>
    )

}

export default Visualizer;