import { FaPlus } from 'react-icons/fa';
import './Header.css'
import AppState from '../AppState';

const Header = () => {

    return (
        <section id="header">
            <div className="control-buttons">
                <div>
                    <button className="btn" onClick={() => {
                        AppState.addCue();
                    }}>
                        <FaPlus />
                    </button>
                </div>
                <div>

                </div>
            </div>
        </section>
    )

}

export default Header;