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
            <div onClick={selectAudioFile} style={{
                backgroundColor: "gray",
                width: "100%",
                height: "5em",
                cursor: 'pointer'
            }}>
                <p>{props.audioFilepath}</p>
            </div>
        </div>
    )

}

export default SelectAudioFile;