import { FaPlus } from 'react-icons/fa';
import './Header.css'
import HiddenInputComponent from '../HiddenInputComponent/HiddenInputComponent';
import { FaGear } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { addCue } from '../State/Project/cueListSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../State/AppStore';
import { setProjectName } from '../State/Project/projectNameSlice';

const Header = () => {

    const projectName = useSelector((state: RootState) => state.projectName.value);

    const dispatch = useDispatch();

    return (
        <section id="header">
            <div className="control-buttons">
                <button className="btn" onClick={() => {
                    dispatch(addCue());
                }}>
                    <FaPlus />
                </button>
            </div>

            <div className='projectName'>
                <HiddenInputComponent value={projectName} setValue={(newValue: string) => {
                    dispatch(setProjectName(newValue));
                }} />
            </div>
            
            <div className='settings'>
                <FaGear className='icon' />
            </div>

        </section>
    )

}

export default Header;