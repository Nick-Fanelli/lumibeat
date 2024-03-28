import { configureStore } from "@reduxjs/toolkit";
import recentProjectsReducer from './recentProjectsSlice'

export const launcherStore = configureStore({
    reducer: {
        recentProjects: recentProjectsReducer
    }
});

export type RootState = ReturnType<typeof launcherStore.getState>
export type LauncherDispatch = typeof launcherStore.dispatch;