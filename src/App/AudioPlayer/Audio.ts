import { convertFileSrc } from '@tauri-apps/api/tauri';
import { Howl } from 'howler' 

export const initializeAudioSystem = () => {

    AudioPlayerManager.initializeSystem();

}

export class AudioPlayer {

    private filepath: string;
    private source: Howl;

    constructor(filepath: string) {
        this.filepath = filepath;
        this.source = new Howl({ src: convertFileSrc(filepath) });

        AudioPlayerManager.reportPlayer(filepath, this);
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

export class AudioPlayerManager {

    private static players: Map<string, AudioPlayer> = new Map();

    static initializeSystem = () => {
        
        this.players.forEach((player) => {
            player.destroy();
        });

        this.players = new Map();

    }

    static reportPlayer = (filepath: string, player: AudioPlayer) => {

        if(this.players.has(filepath))
            this.players.get(filepath)?.destroy();

        this.players.set(filepath, player);

    }

    static requestDestroyPlayer = (filepath: string) => {

        if(this.players.has(filepath))
            this.players.get(filepath)?.destroy();

        this.players.delete(filepath);

    }

    static getPlayer = (filepath: string) : AudioPlayer | undefined => {
        const player = this.players.get(filepath);

        if(player)
            return player;

        console.warn("WARNING: Requesting audio player that doesn't exist :(");
        return new AudioPlayer(filepath);
    }

    static hasPlayer = (filepath: string) => {
        return this.players.has(filepath);
    }

    static play = (filepath: string) => {
        this.players.get(filepath)?.play();
    }

    static stop = (filepath: string) => {
        this.players.get(filepath)?.stop();
    }

}