import './CueList.css'
import Project, { UUID } from '../../Project/Project';
import { Signal, signal } from '@preact/signals-react';
import CueComponent from './CueComponent';

const selectedCues = signal<UUID[]>([]);

type CueListProps = {

    cues: Signal<Project.Cue[]>

}

const reorderArray = (list: any[], sourceIndex: number, destinationIndex: number) : any[] => {
    const result = Array.from(list);
    const [ removed ] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);

    return result;
}


const CueList = ({cues}: CueListProps) => {

    const moveCue = (sourceUUID: UUID, sourceIndex: number, destinatonIndex: number) => {

        let reorderedCues = [...cues.value];

        if(selectedCues.value.length <= 1 || !selectedCues.value.includes(sourceUUID)) {

            reorderedCues = reorderArray(reorderedCues, sourceIndex, destinatonIndex + (sourceIndex > destinatonIndex ? 1 : 0));

        } else {

            let targetCues: Project.Cue[] = [];
            let firstSelectedDestinationIndex: number | null = null;

            for(let i = 0; i < reorderedCues.length; i++) {
                
                const targetUUID = reorderedCues[i].uuid;
                const selectionIndex = selectedCues.value.indexOf(targetUUID);

                if(selectionIndex !== -1) {
                    if(!firstSelectedDestinationIndex)
                        firstSelectedDestinationIndex = i;

                    targetCues.push(reorderedCues[i]);
                    reorderedCues.splice(i, 1);
                    i--;
                }

            }

            if(firstSelectedDestinationIndex !== null) {
                reorderedCues.splice(destinatonIndex + (firstSelectedDestinationIndex > destinatonIndex ? 1 : -1), 0, ...targetCues);
            }

        }

        cues.value = reorderedCues;

    }

    const reportOnCueClick = (event: React.MouseEvent, uuid: UUID) => {

        if(event.shiftKey) { // Shift Through Multi-Select

        } else if(event.ctrlKey) { // TODO: MAKE WORK

        } else {
            selectedCues.value = [uuid];
        }

    }

    const deleteCue = (cue: UUID) => {

        const selectionIndex = selectedCues.value.indexOf(cue);

        if(selectionIndex !== -1) {
            selectedCues.value = selectedCues.value.splice(selectionIndex, 1);
        }

        const updatedCues = Project.removeCueFromListByUUID(cues.value, cue);
        cues.value = updatedCues;

    }

    return (
        <section id="cue-list">

            <table id="cue-table">

                <thead>
                    <tr>
                        <th className="rigid"></th>
                        <th>#</th>
                        <th>Name</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        cues.value.map((cue, index) => (
                            <CueComponent key={index} index={index} cues={cues} cue={cue} moveCue={moveCue} reportOnCueClick={reportOnCueClick} cueSelection={selectedCues} deleteCue={deleteCue} />
                        ))
                    }
                </tbody>
            </table>

        </section>
    )

}

export default CueList;