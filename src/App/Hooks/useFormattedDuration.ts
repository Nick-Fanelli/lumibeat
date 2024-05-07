import { useMemo } from "react"

const formatTime = (s: number) => {

    const minutes = ("0" + Math.floor(s / 60)).slice(-2);
    const seconds = ("0" + Math.floor(s % 60)).slice(-2);
    const decimal = ("00" + Math.floor((s % 1) * 1000)).slice(-3);

    return `${minutes}:${seconds}.${decimal}`;

}

export const useFormattedTimestamp = (timestamp: number) : string => {

    const formattedDuration = useMemo(() => formatTime(timestamp), [timestamp]);

    return formattedDuration;

}