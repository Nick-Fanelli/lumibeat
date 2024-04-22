import { configureStore } from "@reduxjs/toolkit";

import selectedCuesSlice from "./App/selectedCuesSlice";
import cueListSlice from "./Project/cueListSlice";
import projectNameSlice from "./Project/projectNameSlice";

export const appStore = configureStore({
    reducer: {
        // Project
        projectName: projectNameSlice,
        cueList: cueListSlice,

        selectedCues: selectedCuesSlice,
    }
});

export type RootState = ReturnType<typeof appStore.getState>
export type LauncherDispatch = typeof appStore.dispatch;