
import '../index.css'
import './Launcher.css'

import { save, open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";

import { FaFolder, FaPlus, FaTrash } from "react-icons/fa";
import Project from "../Project/Project";
import { exists, readTextFile } from '@tauri-apps/api/fs';
import { useEffect } from 'react';
import { deserializeProjectStruct } from '../Project/ProjectDataStructure';
import { Cache } from '../Cache';
import { signal } from '@preact/signals-react';
import { useAppVersion } from './CustomHooks/useAppVersion';

const recentProjects = signal<Cache.RecentProject[]>([]);

const Launcher = () => {

    const appVersion = useAppVersion();

    // Load Cache
    useEffect(() => {

        const loadCache = async () => {

            const cache = await Cache.loadCache();
            recentProjects.value = cache.recentProjects;

        }

        loadCache();

    }, []);

    const reportOpenedShowFileToRecentCache = (recentProject: Cache.RecentProject) => {
            
        let shouldAppend = true;

        recentProjects.value.forEach((project) => {
            if(project.showfilePath === recentProject.showfilePath) {
                shouldAppend = false;
                return;
            }
        })

        if(shouldAppend) {
            recentProjects.value = [recentProject, ...recentProjects.value];
        } else {
            recentProjects.value = [...recentProjects.value];
        }

    }

    const removeRecentProject = (index: number) => {

        if(index != -1) {
            recentProjects.value = recentProjects.value.filter((_, i) => i !== index);
        }

    }

    const openShowfile = async (filepath: string) => {

        const showfileExists = await exists(filepath);

        if(showfileExists) {

            readTextFile(filepath).then((res) => {

                if(res == undefined || res == null) {
                    console.error("Could not open project!");
                    return;
                }

                const project = deserializeProjectStruct(res);        

                if(project == null || project == undefined) {
                    console.error("Could not resolve project.");
                    return;
                }

                invoke('open_app', { filepath: filepath });
                reportOpenedShowFileToRecentCache({ projectName: project.name!, showfilePath: filepath });
        
            });
        }

    }

    const launchOpenDialog = () => {

        open({
            directory: false,
            multiple: false,
            title: "Open Lumibeat Showfile",
            filters: [{
                name: "Lumibeat Show File",
                extensions: [ 'lumishow' ]
            }]
        }).then((res) => {

            if(res == null || res == undefined) {
                return;
            }

            openShowfile(res.toString());
        })

    }

    const launchCreateDialog = () => {

        save({
            filters: [{
                name: 'Lumibeat Show File',
                extensions: [ "lumishow" ]
            }]
        }).then((res) => {
            
            if(res == null || res == undefined)
                return;

            Project.initializeProjectDirectoryFromShowfile(res).then((res) => {

                if(res == undefined || res == null)
                    return;

                openShowfile(res);

            })


        })

    }

    return (

        <section id="root-app">

            <section id="launcher">

                <div className="left">
                    <div>
                        <h1>Lumibeat</h1>
                        <p>{appVersion}</p>
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
                        <div className="btn" onClick={launchOpenDialog}>
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

                        {
                            recentProjects.value.map((recentProject, index) => (
                                <div className="project" key={index} onClick={() => {
                                    // TODO: ENSURE EXISTS AND IF NOT REMOVE FROM LIST

                                    openShowfile(recentProject.showfilePath);
                                }}>
                                    <h1>{recentProject.projectName}</h1>
                                    <p>{recentProject.showfilePath}</p>
                                    <FaTrash className="x" onClick={() => {
                                        removeRecentProject(recentProjects.value.indexOf(recentProject, 0))
                                    }}></FaTrash>
                                </div>
                            ))
                        }

                    </div>

                </div>

            </section>

            
        </section>

    )

};

export default Launcher;