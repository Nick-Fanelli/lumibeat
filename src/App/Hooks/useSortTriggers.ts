import { useMemo } from "react";
import { Trigger, TriggerUtils } from "../../Project/Project";

export const useSortTriggers = (triggers: Trigger[]) : Trigger[] => {

    const sortedTriggers = useMemo<Trigger[]>(() => {

        return TriggerUtils.sortTriggers(triggers);

    }, [ triggers ]);

    return sortedTriggers;

}