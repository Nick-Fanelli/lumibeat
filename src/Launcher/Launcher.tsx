
import '../index.css'
import './Launcher.css'

import { save, open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";

import { FaFolder, FaPlus, FaTrash } from "react-icons/fa";
import { exists, readTextFile } from '@tauri-apps/api/fs';
import { useEffect } from 'react';
import { Cache } from '../Cache';
import { useAppVersion } from './CustomHooks/useAppVersion';
import { RootState } from './State/LauncherStore';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setRecentProjects } from './State/recentProjectsSlice';
import { listen } from '@tauri-apps/api/event';
import { ProjectUtils } from '../Project/Project';

const useDetectShouldClose = () => {

    useEffect(() => {

        const closeRequestedListener = listen('close-requested', (e) => {

            const windowUUID = e.payload;

            if(windowUUID === "*")
                invoke('close_window');

        });

        return () => {
            closeRequestedListener.then((res) => { res(); });
        }

    }, []);

}

const Launcher = () => {

    const recentProjects = useSelector((state: RootState) => state.recentProjects.value);
    const dispatch = useDispatch();

    const appVersion = useAppVersion();

    useDetectShouldClose();

    // Load Cache
    useEffect(() => {

        const loadCache = async () => {

            const cache = await Cache.loadCache();
            dispatch(setRecentProjects(cache.recentProjects));

        }

        loadCache();

    }, []);

    const reportOpenedShowFileToRecentCache = (recentProject: Cache.RecentProject) => {
            
        let shouldAppend = true;

        recentProjects.forEach((project) => {
            if(project.showfilePath === recentProject.showfilePath) {
                shouldAppend = false;
                return;
            }
        })

        if(shouldAppend) {
            dispatch(setRecentProjects([recentProject, ...recentProjects]))
        } else {
            dispatch(setRecentProjects([...recentProjects]));
        }

    }

    const removeRecentProject = (index: number) => {

        if(index != -1) {
            dispatch(setRecentProjects(recentProjects.filter((_, i) => i !== index)));
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

                const project = ProjectUtils.deserializeProjectString(res);        

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

            ProjectUtils.initializeProjectDirectoryFromShowfile(res).then((res) => {

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
                            recentProjects.map((recentProject, index) => (
                                <div className="project" key={index} onClick={() => {
                                    // TODO: ENSURE EXISTS AND IF NOT REMOVE FROM LIST

                                    openShowfile(recentProject.showfilePath);
                                }}>
                                    <h1>{recentProject.projectName}</h1>
                                    <p>{recentProject.showfilePath}</p>
                                    <FaTrash className="x" onClick={() => {
                                        removeRecentProject(recentProjects.indexOf(recentProject, 0))
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