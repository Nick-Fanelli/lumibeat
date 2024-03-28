import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import Project from "../../../Project/Project";

import { v4 as uuidv4 } from 'uuid';

export interface CueListState {

    value: Project.Cue[]

}

const initialState: CueListState = {

    value: []

}

export const cueListSlice = createSlice({
    name: 'cues',
    initialState,
    reducers: {
        setCueList: (state, action: PayloadAction<Project.Cue[]>) => {
            state.value = action.payload;
        },

        addCue: (state) => {
            state.value = [...state.value, { uuid: uuidv4(), name: "" } ];
        }

    }
});

export const { setCueList, addCue } = cueListSlice.actions;

export default cueListSlice.reducer;