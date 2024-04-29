import { useCallback, useEffect, useRef } from "react";
import { Cue } from "../../Project/Project";
import { useGetCueAudioPlayer } from "../Hooks/useGetCueAudioPlayer";

type VisualizerProps = {

    cue: Cue

}

const Visualizer = (props: VisualizerProps) => {

    const { audioPlayer, playhead, duration, triggers } = useGetCueAudioPlayer(props.cue);
    const visualizerRef = useRef<HTMLDivElement>(null);

    // const formattedDuration = useMemo(() => formatTime(props.audioPlayer.getDuration()), [props.audioPlayer]);

    const onVisualizerClick = useCallback((x: number) => {

        if(!audioPlayer)
            return;

        const relativeClickPosition = x / visualizerRef.current!.offsetWidth;
        const newPlayheadPosition = relativeClickPosition * duration;
        const clampedPlayheadPosition = Math.min(Math.max(newPlayheadPosition, 0), duration);

        audioPlayer.seekTo(clampedPlayheadPosition);

    }, [ audioPlayer, visualizerRef.current]);

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

    if(!audioPlayer)
        return <section id="visualizer"></section>

    return (
        <>
            <section id="visualizer">

                <div className="waveform" ref={visualizerRef}>

                    <div className="midline"></div>
                
                    {
                        triggers.map((trigger, index) => (
                            <div key={index} className='trigger' style={{
                                left: `${(trigger.timestamp / duration) * 100}%`
                            }}></div>
                        ))
                    }

                    <div className="playhead" style={{
                        left: `${(playhead / duration) * 100}%`
                    }}></div>

                </div>

            </section>
        </>
    )

}

export default Visualizer;