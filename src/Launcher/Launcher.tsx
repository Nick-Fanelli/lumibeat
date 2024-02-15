
import '../index.css'
import './Launcher.css'

import { save } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";

import { FaFolder, FaPlus, FaTrash } from "react-icons/fa";
import Project from "../Project/Project";

const Launcher = () => {

    // const launchOpenDialog = () => {

    // }

    const launchCreateDialog = () => {

        save({
            filters: [{
                name: 'Lumibeat Show File',
                extensions: [ "lumishow" ]
            }]
        }).then((res) => {
            
            if(res == null || res == undefined)
                return;

            Project.initializeProjectDirectoryFromShowfile(res);

        })

        // open({
        //     directory: true,
        //     multiple: false,
        //     title: "Create New Project",
        // }).then((res) => {
        //     console.log(res);
        // });

    }

    return (

        <section id="root-app">

            <section id="launcher">

                <div className="left">
                    <div>
                        <h1>Lumibeat</h1>
                        <p>v0.0.0-alpha</p>
                    </div>

                    <div className="buttons">
                        <div className="btn" onClick={launchCreateDialog}>
                            <div className="icon-wrapper">
                                <FaPlus className="icon" />
                            </div>
                            <div className="description">
                                <h1>Create New Show</h1>
                                <p>Creates a new Lumibeat show file you can save to your local computer.</p>
                            </div>
                        </div>
                        <div className="btn" onClick={() => invoke('open_app')}>
                            <div className="icon-wrapper">
                                <FaFolder className="icon" />
                            </div>
                            <div className="description">
                                <h1>Open Existing Show</h1>
                                <p>Opens an existing show file on your local computer to be run.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right">

                    <h1>Recent Projects</h1>

                    <div className="projects">

                        {/* <div className="project">
                            <h1>Some Project</h1>
                            <p>/Users/johndoe/Desktop/Some Project</p>
                            <FaTrash className="x"></FaTrash>
                        </div> */}

                    </div>

                </div>

            </section>

            
        </section>

    )

};

export default Launcher;