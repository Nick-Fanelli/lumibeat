import { FaLessThan } from 'react-icons/fa';
import './SelectAudioFile.css'
import Project from '../../Project/Project';
import { open } from '@tauri-apps/api/dialog';

type Props = {

    cue: Project.Cue
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
        <div className='select-audio-file' onClick={selectAudioFile}>
            <h1 className='label'>Audio File Resource Path</h1>
            <div className="selection-box">
                <div>
                    <p>{props.audioFilepath}</p>
                </div>
                <div className="selection-btn">
                    <FaLessThan />
                </div>
            </div>
        </div>
    )

}

export default SelectAudioFile;