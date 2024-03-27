import './CueList.css'
import Project, { UUID } from '../../Project/Project';
import { Signal, signal } from '@preact/signals-react';
import CueComponent from './CueComponent';
import { Tooltip } from 'react-tooltip';

const selectedCues = signal<UUID[]>([]);

type CueListProps = {

    cues: Signal<Project.Cue[]>

}

const CueList = ({cues}: CueListProps) => {

    const moveCue = (sourceIndex: number, destinationIndex: number) => {

        if(sourceIndex < 0 || sourceIndex >= cues.value.length || destinationIndex < 0 || destinationIndex >= cues.value.length) {
            console.error("Invalid source index or destination index (out of bounds)");
            return;
        }

        if(sourceIndex === destinationIndex)
            return;

        let reorderedCues = [...cues.value];

        const [objectToMove] = reorderedCues.splice(sourceIndex, 1);
        reorderedCues.splice(destinationIndex, 0, objectToMove);

        cues.value = reorderedCues;

    }

    const reportOnCueClick = (event: React.MouseEvent, uuid: UUID) => {

        if(event.shiftKey) { // Shift Through Multi-Select

        } else if(event.ctrlKey) { // FIXME: MAKE WORK

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

            <Tooltip id="cue-uuid" />

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