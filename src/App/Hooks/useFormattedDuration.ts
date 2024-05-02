import { useMemo } from "react"

const formatTime = (seconds: number) => [seconds / 60, seconds % 60, (seconds % 1) * 1000].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':');

export const useFormattedDuration = (timestamp: number) : string => {

    const formattedDuration = useMemo(() => formatTime(timestamp), [timestamp]);

    return formattedDuration;

}