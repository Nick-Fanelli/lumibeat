import { useCallback, useEffect, useRef, useState } from 'react';
import './AudioVisualizer.css';
import { convertFileSrc } from '@tauri-apps/api/tauri';

const formatTime = (seconds: number) => [seconds / 60, seconds % 60, (seconds % 1) * 1000].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':');

const audioFilepath = convertFileSrc("/Users/nickfanelli/Downloads/spotifydown.com - American Ride.mp3");

const downsampleChannelData = (channelData: Float32Array, skipFactor: number): Float32Array => {

    const downsampledData = new Float32Array(Math.floor(channelData.length / skipFactor));

    for(let i = 0; i < downsampledData.length; i++) {
        downsampledData[i] = channelData[i * skipFactor];
    }

    return downsampledData;

}

const AudioVisualizer = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [channelData, setChannelData] = useState<Float32Array | undefined>(undefined);

    const drawWaveform = useCallback(() => {
        if(canvasRef.current == null)
            return;

        if(!channelData)
            return;

        const canvas = canvasRef.current;
        
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "orange";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const lineWidth = 2;

        ctx.fillStyle = "blue";

        const start = 5000;
        const size = 300;

        for(let i = start; i < start + size; i++) {

            let value = channelData[i];

            if(value <= 0)
                continue;

            ctx.fillRect((i - start) * lineWidth, 0, lineWidth, value * canvas.height);
        }

        // ctx.fillStyle = "blue";
        // ctx.fillRect(0, 0, lineWidth, canvas.height);
    }, [channelData]);

    useEffect(() => {

        const fetchAudio = async () => {

            const response = await fetch(audioFilepath);
            const audioBlob = await response.arrayBuffer();

            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(audioBlob);

            if(audioBuffer.numberOfChannels == 1) {

                console.log("Drawing single channel");

                const channelData = downsampleChannelData(audioBuffer.getChannelData(0), 10);
                // drawWaveform(channelData, 0);
                    
            } else if(audioBuffer.numberOfChannels == 2) {
        
                console.log("Drawing two channels");

                console.log(audioBuffer.sampleRate);

                const leftChannelData = downsampleChannelData(audioBuffer.getChannelData(0), 10);
                const rightChannelData = downsampleChannelData(audioBuffer.getChannelData(1), 10);

                // drawWaveform(leftChannelData, 0);
                // drawWaveform(rightChannelData, canvas.height / 2);
                setChannelData(leftChannelData);
                drawWaveform();


            }

        }

        fetchAudio();

    }, [audioFilepath, setChannelData, drawWaveform]);


    return (
        <section id="audio-visualizer">
            <canvas ref={canvasRef} onResize={() => drawWaveform()}></canvas>
       </section>
    )

};

export default AudioVisualizer;
