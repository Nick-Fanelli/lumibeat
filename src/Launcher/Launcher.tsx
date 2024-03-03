
import '../index.css'
import './Launcher.css'

import { save, open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";

import { FaFolder, FaPlus, FaTrash } from "react-icons/fa";
import Project from "../Project/Project";
import { exists, readTextFile } from '@tauri-apps/api/fs';
import { useCallback, useEffect, useState } from 'react';
import { deserializeProjectStruct } from '../Project/ProjectDataStructure';
import { Cache } from '../Cache';

const Launcher = () => {

    const [recentProjects, setRecentProjects] = useState<Cache.RecentProject[]>([]);
    const [isCacheLoaded, setIsCacheLoaded] = useState<boolean>(false);


    // Load Cache
    useEffect(() => {

        const loadCache = async () => {

            const cache = await Cache.loadCache();
            setRecentProjects(cache.recentProjects);

            setIsCacheLoaded(true);

        }

        loadCache();

    }, [setRecentProjects, setIsCacheLoaded]);

    useEffect(() => {

        if(isCacheLoaded) {
            Cache.cache.recentProjects = recentProjects;
            Cache.commitCache();
        }

    }, [isCacheLoaded, recentProjects]);

    const reportOpenedShowFileToRecentCache = useCallback((recentProject: Cache.RecentProject) => {

        setRecentProjects((prev) => {

            let shouldAppend = true;

            prev.forEach((project) => {
                if(project.showfilePath === recentProject.showfilePath) {
                    shouldAppend = false;
                    return;
                }
            });

            if(shouldAppend)
                return [recentProject, ...prev]
            else
                return [...prev];
        });

    }, [setRecentProjects]);

    const removeRecentProject = useCallback((index: number) => {

        setRecentProjects((prev) => {

            const newArray = prev.splice(index, 1);
            return [...newArray];

        });

    }, [setRecentProjects]);

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
                            recentProjects.map((recentProject, index) => (
                                <div className="project" key={index} onClick={() => {
                                    // TODO: ENSURE EXISTS AND IF NOT REMOVE FROM LIST
                                    openShowfile(recentProject.showfilePath);
                                }}>
                                    <h1>{recentProject.projectName}</h1>
                                    <p>{recentProject.showfilePath}</p>
                                    <FaTrash className="x" onClick={() => {
                                        removeRecentProject(index)
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