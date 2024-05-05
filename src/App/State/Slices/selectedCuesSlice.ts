import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UUID } from "../../../Project/Project";

export interface SelectedCuesState {

    value: UUID[]

}

const initialState: SelectedCuesState = {

    value: []

}

export const selectedCuesSlice = createSlice({
    name: 'selectedCues',
    initialState: initialState,
    reducers: {
        setSelectedCues: (state, action: PayloadAction<UUID[]>) => {
            state.value = action.payload;
        }
    }
});

export const { setSelectedCues } = selectedCuesSlice.actions;

export default selectedCuesSlice.reducer;