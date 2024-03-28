import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Cache } from "../../Cache"

export interface RecentProjectsState {

    value: Cache.RecentProject[]

}

const initialState: RecentProjectsState = {

    value: []

}

export const recentProjectsSlice = createSlice({
    name: 'recentProjects',
    initialState,
    reducers: {
        setRecentProjects: (state, action: PayloadAction<Cache.RecentProject[]>) => {
            state.value = action.payload;
        }
    }
});

export const { setRecentProjects } = recentProjectsSlice.actions;

export default recentProjectsSlice.reducer;