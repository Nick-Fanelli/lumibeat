import { useEffect, useState } from "react";
import { Cue } from "../../Project/Project";
import { AudioPlayer, AudioPlayerManager } from "../AudioPlayer/Audio";
import Trigger from "../Properties/Trigger";
import { useFormattedTimestamp } from "./useFormattedDuration";

export const useGetCueAudioPlayer = (cue: Cue | undefined) : { audioPlayer: AudioPlayer | undefined, playhead: number, formattedPlayhead: string, duration: number, triggers: Trigger[] } => {

    const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | undefined>(undefined);
    const [triggers, setTriggers] = useState<Trigger[]>([]);

    const [playhead, setPlayhead] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const formattedPlayhead = useFormattedTimestamp(playhead);

    useEffect(() => {

        if(!cue)
            return;

        const player = AudioPlayerManager.getPlayer(cue.uuid);

        setAudioPlayer(player);
        setTriggers(cue.triggers || []);

        if(player) {
            setDuration(player.getDuration());
        } else {
            setDuration(0);
        }

    }, [cue]);

    useEffect(() => {

        const playbackRefreshInterval = setInterval(() => {

            if(audioPlayer) {
                setPlayhead((prev) => {

                    if(audioPlayer.getCurrentTime() !== prev) {
                        return audioPlayer.getCurrentTime();
                    }

                    return prev;
                });
            }

        }, 10);

        return () => {
            clearInterval(playbackRefreshInterval);
            setPlayhead(0);
        }

    }, [audioPlayer])

    return { audioPlayer, playhead, formattedPlayhead, duration, triggers };

}