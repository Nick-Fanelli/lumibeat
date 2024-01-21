import CueList from "./CueList/CueLIst";
import Header from "./Header/Header";
import SplitPane from "./SplitPane/SplitPane";

import './App.css'
import Properties from "./Properties/Properties";

const App = () => {

    return (

        <section id="root-app" className="dark">

            <Header />

            <SplitPane>
                
                <CueList />
                <Properties />

            </SplitPane>

            <div className="footer" style={{
                backgroundColor: 'red',
                width: "100%",
                height: "50px"
            }}>
                <h1>Test</h1>
            </div>
            
        </section>

    )

}

export default App;
