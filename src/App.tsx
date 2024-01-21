import CueList from "./CueList/CueLIst";
import Header from "./Header/Header";
import SplitPane from "./SplitPane/SplitPane";

const App = () => {

    return (

        <section id="root-app" className="dark">

            <Header />

            <SplitPane>
                
                <CueList />
                <div style={{width: "100%", height: "100%"}}></div>

            </SplitPane>
            
        </section>

    )

}

export default App;
