import { FaPlus } from 'react-icons/fa';
import './Header.css'
import AppState from '../AppState';
import HiddenInputComponent from '../HiddenInputComponent/HiddenInputComponent';

const Header = () => {

    return (
        <section id="header">
            <div className="control-buttons">
                <button className="btn" onClick={() => {
                    AppState.addCue();
                }}>
                    <FaPlus />
                </button>
            </div>

            <div className='projectName'>
                <HiddenInputComponent value={AppState.projectName.value} setValue={(newValue: string) => {
                    AppState.projectName.value = newValue
                }} />
            </div>
            
            <div></div>

        </section>
    )

}

export default Header;