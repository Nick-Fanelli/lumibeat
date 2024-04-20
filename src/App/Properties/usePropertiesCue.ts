import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../State/AppStore";
import { useDispatch } from "react-redux";
import { redefineCue } from "../State/Project/cueListSlice";
import { Cue, CueListUtils, UUID } from "../../Project/Project";

const usePropertiesCue = (selectedCues: UUID[]) : [ Cue | undefined, (cue: Cue) => void ]=> {

    const dispatch = useDispatch();

    const cueList = useSelector((state: RootState) => state.cueList.value);

    const [cue, rawSetCue] = useState<Cue | undefined>(undefined);

    const setCue = useCallback((cue: Cue) => {

        dispatch(redefineCue(cue));
        rawSetCue(cue);

    }, [rawSetCue]);

    useEffect(() => {

        if(selectedCues.length === 1) {
            rawSetCue(CueListUtils.getCueByUUID(cueList, selectedCues[0]));
        }

    }, [selectedCues, cueList]);

    return [ cue, setCue ];

}

export default usePropertiesCue;