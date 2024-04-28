import './SelectAudioFile.css'
import { open } from '@tauri-apps/api/dialog';
import { Cue } from '../../Project/Project';

type Props = {

    cue: Cue
    audioFilepath: string | undefined,
    setAudioFilepath: (filepath: string) => void

}

const SelectAudioFile = (props: Props) => {

    const selectAudioFile = () => {

        open({
            directory: false,
            multiple: false,
            filters: [{
                name: "Audio File",
                extensions: ['mp3', 'wav']
            }]
        }).then((res) => {

            if(res == null || res == undefined)
                return;

            if(Array.isArray(res))
                return;

            props.setAudioFilepath(res);

        });

    }
    
    return (
        <div className='select-audio-file'>
            <h1 className='label'>Audio File Resource Path</h1>
            <input type="text" contentEditable={false} value={props.audioFilepath} onClick={selectAudioFile} />
        </div>
    )

}

export default SelectAudioFile;