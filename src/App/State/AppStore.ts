import { configureStore } from "@reduxjs/toolkit";

import selectedCuesSlice from "./Slices/selectedCuesSlice";
import cueListSlice from "./Slices/cueListSlice";
import projectNameSlice from "./Slices/projectNameSlice";

export const appStore = configureStore({
    reducer: {
        // Project
        projectName: projectNameSlice,
        cueList: cueListSlice,

        selectedCues: selectedCuesSlice,
    }
});

export type AppState = ReturnType<typeof appStore.getState>
export type AppDispatch = typeof appStore.dispatch;