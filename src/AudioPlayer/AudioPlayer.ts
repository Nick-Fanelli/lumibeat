import { convertFileSrc } from '@tauri-apps/api/tauri';
import { Howl } from 'howler' 

let audioPlayers : AudioPlayer[] = [];

export const initializeAudioSystem = () => {

    audioPlayers.forEach((player) => {
        player.destroy();
    });

    audioPlayers = [];

}

export class AudioPlayer {

    private filepath: string;
    private source: Howl;

    private constructor(filepath: string, source: Howl) {
        this.filepath = filepath;
        this.source = source;

        audioPlayers.push(this);
    }

    static async createAudioPlayer(filepath: string): Promise<AudioPlayer> {
        const sound = new Howl({
            src: convertFileSrc(filepath),
        });

        const audioPlayer = new AudioPlayer(filepath, sound);
        return Promise.resolve(audioPlayer);
    }

    getFilepath() : string { return this.filepath; }

    isPlaying(): boolean {
        return this.source.playing();
    }

    play() {
        if(this.isPlaying())
            this.source.stop();

        this.source.play();
    }

    pause() {
        this.source.pause();
    }

    stop() {
        this.source.stop();
    }

    playPause() {
        if(this.isPlaying())
            this.pause();
        else
            this.play();
    }

    getDuration(): number { 
        return this.source.duration();
    }

    getCurrentTime(): number { 
        return this.source.seek();
    }

    seekTo(seek: number) {
        this.source.seek(seek);
    }

    destroy() {
        this.stop();
        this.source.unload();
    }

}