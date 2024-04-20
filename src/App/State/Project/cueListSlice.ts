import { PayloadAction, createSlice, freeze } from "@reduxjs/toolkit"

import { v4 as uuidv4 } from 'uuid';
import { AudioPlayer } from "../../AudioPlayer/AudioPlayer";
import { Cue, CueListUtils, UUID } from "../../../Project/Project";

export interface CueListState {

    value: Cue[]

}

const initialState: CueListState = {

    value: []

}

export const cueListSlice = createSlice({
    name: 'cues',
    initialState,
    reducers: {
        setCueList: (state, action: PayloadAction<Cue[]>) => {
            state.value = action.payload;
        },

        addCue: (state) => {
            state.value = [...state.value, { uuid: uuidv4(), name: "" } ];
        },

        redefineCue: (state, action: PayloadAction<Cue>) => {
            
            const lookupCue = CueListUtils.getCueByUUID(state.value, action.payload.uuid);

            if(lookupCue !== action.payload) {
                
                const cueIndex = CueListUtils.getCueIndexByUUID(state.value, action.payload.uuid);

                if(cueIndex !== -1) {
                   state.value = [
                        ...state.value.slice(0, cueIndex),
                        action.payload,
                        ...state.value.slice(cueIndex + 1)
                    ];

                    return;
                }

            }

            console.error("Error with redefine cue reducer");

        },

        setCueAudioPlayer: (state, action: PayloadAction<[UUID, AudioPlayer | undefined]>) => {

            const lookupCue = CueListUtils.getCueByUUID(state.value, action.payload[0]);

        }

    }
});

export const { setCueList, addCue, redefineCue, setCueAudioPlayer } = cueListSlice.actions;

export default cueListSlice.reducer;