import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface ProjectNameState {

    value: string

}

const initialState: ProjectNameState = {

    value: ""

}

export const projectNameSlice = createSlice({
    name: 'projectName',
    initialState,
    reducers: {
        setProjectName: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        }
    }
});

export const { setProjectName } = projectNameSlice.actions;

export default projectNameSlice.reducer;