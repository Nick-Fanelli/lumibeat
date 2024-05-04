import { useMemo } from "react";
import Trigger from "../Properties/Trigger";


export const useSortTriggers = (triggers: Trigger[]) : Trigger[] => {

    const sortedTriggers = useMemo<Trigger[]>(() => {

        let tArray = [...triggers];

        return tArray.sort((t1, t2) => {

            if(t1.timestamp == t2.timestamp)
                return 0;

            return (t1.timestamp > t2.timestamp) ? 1 : -1;

        });

    }, [ triggers ]);

    return sortedTriggers;

}