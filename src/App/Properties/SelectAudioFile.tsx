import { FaLessThan } from 'react-icons/fa';
import './SelectAudioFile.css'
import Project from '../../Project/Project';

type Props = {

    cue: Project.Cue

}

const SelectAudioFile = (props: Props) => {

    props;

    return (
        <div className='select-audio-file'>
            <h1 className='label'>Audio File Resource Path</h1>
            <div className="selection-box">
                <div>
                    <p></p>
                </div>
                <div className="selection-btn">
                    <FaLessThan />
                </div>
            </div>
        </div>
    )

}

export default SelectAudioFile;