import { LegacyRef } from 'react';
import { DragDropContext, Draggable, DropResult, DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps, } from 'react-beautiful-dnd';
import './CueList.css'
import { StrictModeDroppable } from './StrictModeDroppable';
import Project from '../../Project/Project';
import { Signal, signal } from '@preact/signals-react';
import HiddenInputComponent from '../HiddenInputComponent/HiddenInputComponent';

const selectedCues = signal<string[]>([]);

const setActiveCue = (uuid: string) => {

    selectedCues.value = [uuid];

}

type CueProps = {

    cue: Project.Cue
    innerRef: LegacyRef<HTMLTableRowElement> | undefined
    draggableProps: DraggableProvidedDraggableProps
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined

}

const Cue = (props: CueProps) => {

    selectedCues.value;

    const isCueSelected = (uuid: string) : boolean => {
        return selectedCues.value.includes(uuid);
    }

    const setCueName = (name: string) => {

        props.cue.name = name;

    }

    return (

        <>
            <td className="info" style={{ width: "100px" }}>
                <div className="machine-id"></div>
                <div className="machine-highlight"></div>
            </td>
            <td className="cue-number" style={{ width: "100px" }}>
                <h1>1</h1>
            </td>
            <td>
                <h1>Hi</h1>
            </td>
            <td>{props.cue.name} 10</td>
        </>

    );

}

type CueListProps = {

    cues: Signal<Project.Cue[]>

}

const CueList = ({cues}: CueListProps) => {

    cues.value; // Make Reactive

    const onDragEnd = (result: DropResult) => {
        
        if(!result.destination)
            return;

        const reorderedItems = Array.from(cues.value);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        cues.value = reorderedItems;

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
                    <DragDropContext onDragEnd={onDragEnd}>
                        <StrictModeDroppable droppableId='cueDroppable'>
                            {(provided) => (

                                <tr
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    
                                    {
                                        cues.value.map((item, index) => {

                                            return <Draggable key={item.uuid} draggableId={item.uuid} index={index}>
                                                {(provided) => (
                                                    <Cue 
                                                        cue={item}
                                                        innerRef={provided.innerRef}
                                                        draggableProps={provided.draggableProps}
                                                        dragHandleProps={provided.dragHandleProps}
                                                    />
                                                )}

                                            </Draggable>

                                        })
                                    }

                                    {provided.placeholder}
                                </tr>

                            )}
                            </StrictModeDroppable>
                    </DragDropContext>
                </tbody>
            </table>

        </section>
    )

}

export default CueList;