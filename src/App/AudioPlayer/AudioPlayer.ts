import { convertFileSrc } from '@tauri-apps/api/tauri';
import { Howl } from 'howler' 

let audioPlayers : AudioPlayer[] = [];
let sources : Map<string, Howl> = new Map();

export const initializeAudioSystem = () => {

    audioPlayers.forEach((player) => {
        player.destroy();
    });

    audioPlayers = [];
    
    sources.forEach((source) => source.unload());
    sources.clear();

}

const getAudioSource = (filepath: string) : Howl => {

    if(!sources.has(filepath)) {

        const howl = new Howl({
            src: convertFileSrc(filepath)
        });

        sources.set(filepath, howl);

    }

    return sources.get(filepath)!;

}

export class AudioPlayer {

    private filepath: string;

    constructor(filepath: string) {
        this.filepath = filepath;

        getAudioSource(this.filepath); // Create audio source

        audioPlayers.push(this);
    }

    getFilepath() : string { return this.filepath; }

    isPlaying(): boolean {
        return getAudioSource(this.filepath).playing();
    }

    play() {
        if(this.isPlaying())
            getAudioSource(this.filepath).stop();

        getAudioSource(this.filepath).play();
    }

    pause() {
        getAudioSource(this.filepath).pause();
    }

    stop() {
        getAudioSource(this.filepath).stop();
    }

    playPause() {
        if(this.isPlaying())
            this.pause();
        else
            this.play();
    }

    getDuration(): number { 
        return getAudioSource(this.filepath).duration();
    }

    getCurrentTime(): number { 
        return getAudioSource(this.filepath).seek();
    }

    seekTo(seek: number) {
        getAudioSource(this.filepath).seek(seek);
    }

    destroy() {
        this.stop();
        getAudioSource(this.filepath).unload();
    }

}