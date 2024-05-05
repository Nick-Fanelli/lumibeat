import { useEffect, useState } from "react";
import { Trigger, TriggerUtils } from "../../Project/Project";

export const useSortTriggers = (triggers: Trigger[]) : Trigger[] => {

    const [sortedTriggers, setSortedTriggers] = useState<Trigger[]>([]);

    useEffect(() => {

        setSortedTriggers(TriggerUtils.sortTriggers(triggers));

    }, [triggers]);

    return sortedTriggers;

}