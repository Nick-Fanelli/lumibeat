import { convertFileSrc } from '@tauri-apps/api/tauri';
import { Howl } from 'howler' 
import { UUID } from '../../Project/Project';

export const initializeAudioSystem = () => {

    AudioPlayerManager.initializeSystem();

}

export class AudioPlayer {

    private filepath: string;
    private source: Howl;

    constructor(uuid: UUID, filepath: string) {
        this.filepath = filepath;
        this.source = new Howl({ src: convertFileSrc(filepath) });

        AudioPlayerManager.reportPlayer(uuid, this);
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

    private static players: Map<UUID, AudioPlayer> = new Map();

    static initializeSystem = () => {
        
        this.players.forEach((player) => {
            player.destroy();
        });

        this.players = new Map();

    }

    static reportPlayer = (uuid: UUID, player: AudioPlayer) => {

        if(this.players.has(uuid))
            this.players.get(uuid)?.destroy();

        this.players.set(uuid, player);

    }

    static getPlayer = (uuid: UUID) : AudioPlayer | undefined => {
        return this.players.get(uuid);
    } 

    static requestDestroyPlayer = (uuid: UUID) => {

        if(this.players.has(uuid))
            this.players.get(uuid)?.destroy();

        this.players.delete(uuid);

    }

    static hasPlayer = (uuid: UUID) => {
        return this.players.has(uuid);
    }

    static play = (uuid: UUID) => {
        this.players.get(uuid)?.play();
    }

    static stop = (uuid: UUID) => {
        this.players.get(uuid)?.stop();
    }

}