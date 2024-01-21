import Path from '../Path/Path';
import './Header.css'

const Header = () => {

    return (
        <section id="header">
            <div>
                <button id='go'>GO</button>
                <div>
                    <input type="text" name="Cue Name" id="cue-name" />
                    <Path path={"/Users/nickfanelli/SomeAudioFile"} />
                </div>
            </div>
        </section>
    )

}

export default Header;