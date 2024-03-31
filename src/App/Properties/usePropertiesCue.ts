import { useCallback, useEffect, useState } from "react";
import Project, { UUID } from "../../Project/Project";
import { useSelector } from "react-redux";
import { RootState } from "../State/AppStore";
import { useDispatch } from "react-redux";
import { redefineCue } from "../State/Project/cueListSlice";

const usePropertiesCue = (selectedCues: UUID[]) : [ Project.Cue | undefined, (cue: Project.Cue) => void ]=> {

    const dispatch = useDispatch();

    const cueList = useSelector((state: RootState) => state.cueList.value);

    const [cue, rawSetCue] = useState<Project.Cue | undefined>(undefined);

    const setCue = useCallback((cue: Project.Cue) => {

        dispatch(redefineCue(cue));
        rawSetCue(cue);

    }, [rawSetCue]);

    useEffect(() => {

        if(selectedCues.length === 1) {
            rawSetCue(Project.getCueByUUID(cueList, selectedCues[0]));
        }

    }, [selectedCues, cueList]);

    return [ cue, setCue ];

}

export default usePropertiesCue;