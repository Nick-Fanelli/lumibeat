import { useEffect, useState } from "react";
import { Cue } from "../../Project/Project";
import { AudioPlayer, AudioPlayerManager } from "../AudioPlayer/Audio";

export const useGetCueAudioPlayer = (cue: Cue) : { audioPlayer: AudioPlayer | undefined, playhead: number, duration: number } => {

    const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | undefined>(undefined);

    const [playhead, setPlayhead] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    useEffect(() => {

        const player = AudioPlayerManager.getPlayer(cue.uuid);

        setAudioPlayer(player);

        if(player) {
            setDuration(player.getDuration());
        } else {
            setDuration(0);
        }

    }, [cue]);

    useEffect(() => {

        const playbackRefreshInterval = setInterval(() => {

            if(audioPlayer)
                setPlayhead(audioPlayer.getCurrentTime());

        }, 10);

        return () => {
            clearInterval(playbackRefreshInterval);
            setPlayhead(0);
        }

    }, [audioPlayer])

    return { audioPlayer, playhead, duration };

}