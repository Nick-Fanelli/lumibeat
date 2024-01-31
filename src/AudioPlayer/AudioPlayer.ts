import { convertFileSrc } from '@tauri-apps/api/tauri';
import { Howl } from 'howler' 

export class AudioPlayer {

    private filepath: string;
    private source: Howl;

    private constructor(filepath: string, source: Howl) {
        this.filepath = filepath;
        this.source = source;
    }

    static async createAudioPlayer(filepath: string): Promise<AudioPlayer> {
        const sound = new Howl({
            src: convertFileSrc(filepath),
        });

        return Promise.resolve(new AudioPlayer(filepath, sound));
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

}

// This function remains unnecessary with Howler.js

// function resumeAudioContext() {
//     // Not applicable with Howler.js
// }

// Remember to start playback on user interaction, not automatically.
