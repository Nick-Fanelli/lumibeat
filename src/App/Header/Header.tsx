import { FaPlus } from 'react-icons/fa';
import './Header.css'
import { addCue } from '../App';

const Header = () => {

    return (
        <section id="header">
            <div className="control-buttons">
                <div>
                    <button className="btn" onClick={() => {
                        addCue();
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