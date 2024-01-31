import { readBinaryFile } from "@tauri-apps/api/fs";

export class AudioSource {

    private filepath: string;
    private audioBuffer: AudioBuffer;

    private constructor(filepath: string, audioBuffer: AudioBuffer) {
        this.filepath = filepath;
        this.audioBuffer = audioBuffer;
    }

    getAudioBuffer() : AudioBuffer { return this.audioBuffer; }
    getFilepath() : string { return this.filepath; }

    static async createAudioSourceFromFile(filepath: string) : Promise<AudioSource> {

        const audioContext = new AudioContext();

        const bytes = await readBinaryFile(filepath);
        const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);

        return Promise.resolve(new AudioSource(filepath, audioBuffer));

    }
}

export class AudioPlayer {

    private audioContext: AudioContext;
    private source: AudioBufferSourceNode;
    private currentTimeParam: AudioParam;

    constructor(audioSource: AudioSource) {

        this.audioContext = new AudioContext();

        this.source = this.audioContext.createBufferSource();
        this.source.buffer = audioSource.getAudioBuffer();
        this.source.connect(this.audioContext.destination);

        this.currentTimeParam = this.audioContext.createConstantSource().offset;
        this.currentTimeParam.value = 0;

    }

    play() {
        this.currentTimeParam.setValueAtTime(
            this.audioContext.currentTime,
            this.audioContext.currentTime
        );

        this.source.start();
    }

    getDuration() : number { return this.source.buffer!.duration; }

    getCurrentTime() : number {
        return this.currentTimeParam.value;
    }
    
}