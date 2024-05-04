import './CueList.css'
import CueComponent from './CueComponent';
import { Tooltip } from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../State/AppStore';
import { setSelectedCues } from '../State/App/selectedCuesSlice';
import { setCueList } from '../State/Project/cueListSlice';
import { CueListUtils, UUID } from '../../Project/Project';

const CueList = () => {

    const dispatch = useDispatch();
    
    const selectedCues = useSelector((state: RootState) => state.selectedCues.value);
    const cueList = useSelector((state: RootState) => state.cueList.value);

    const moveCue = (sourceIndex: number, destinationIndex: number) => {

        if(sourceIndex < 0 || sourceIndex >= cueList.length || destinationIndex < 0 || destinationIndex >= cueList.length) {
            console.error("Invalid source index or destination index (out of bounds)");
            return;
        }

        if(sourceIndex === destinationIndex)
            return;

        let reorderedCues = [...cueList];

        const [objectToMove] = reorderedCues.splice(sourceIndex, 1);
        reorderedCues.splice(destinationIndex, 0, objectToMove);

        dispatch(setCueList(reorderedCues));

    }

    const reportOnCueClick = (event: React.MouseEvent, uuid: UUID) => {

        if(event.shiftKey) { // Shift Through Multi-Select

        } else if(event.ctrlKey) { // FIXME: MAKE WORK

        } else {
            dispatch(setSelectedCues([uuid]));
        }

    }

    const deleteCue = (cue: UUID) => {

        const selectionIndex = selectedCues.indexOf(cue);

        if(selectionIndex !== -1) {

            let updatedSelectedCues = [...selectedCues];
            updatedSelectedCues.splice(selectionIndex, 1);

            dispatch(setSelectedCues(updatedSelectedCues));

        }

        const updatedCues = CueListUtils.removeCueFromListByUUID(cueList, cue);
        dispatch(setCueList(updatedCues));

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
                        cueList.map((cue, index) => (
                            <CueComponent key={index} index={index} cue={cue} moveCue={moveCue} reportOnCueClick={reportOnCueClick} deleteCue={deleteCue} />
                        ))
                    }
                </tbody>
            </table>

        </section>
    )

}

export default CueList;