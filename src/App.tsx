import CueList from "./CueList/CueLIst";
import Header from "./Header/Header";
import SplitPane from "./SplitPane/SplitPane";

import './App.css'
import Properties from "./Properties/Properties";
import StatusBar from "./StatusBar/StatusBar";

const App = () => {

    return (

        <section id="root-app" className="dark">

            <Header />

            <SplitPane>
                
                <CueList />
                <Properties />

            </SplitPane>

            <StatusBar />
            
        </section>

    )

}

export default App;
