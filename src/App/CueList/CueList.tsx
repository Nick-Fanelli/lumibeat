import { LegacyRef } from 'react';
import { DragDropContext, Draggable, DropResult, DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps, } from 'react-beautiful-dnd';
import './CueList.css'
import { StrictModeDroppable } from './StrictModeDroppable';
import { Signal } from '@preact/signals-react';
import Project from '../../Project/Project';

type CueProps = {

    cue: Project.Cue
    innerRef: LegacyRef<HTMLDivElement> | undefined
    draggableProps: DraggableProvidedDraggableProps
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined

}

const Cue = (props: CueProps) => {

    return (
        <div 
            className={`cue ${props.cue.selected ? 'selected' : ''}`}
            ref={props.innerRef}
            {...props.draggableProps}
        >
            <h1>{props.cue.name}</h1>
            <div className="hamburger-icon" {...props.dragHandleProps}>☰</div>
        </div>
    )

}

type CueListProps = {

    cues: Signal<Project.Cue[]>

}

const CueList = ({cues}: CueListProps) => {

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

            <DragDropContext onDragEnd={onDragEnd}>

                <StrictModeDroppable droppableId='cueDroppable'>
                    {(provided) => (

                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            
                            {
                                cues.value.map((item, index) => (

                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (

                                            <Cue 
                                                cue={item}
                                                innerRef={provided.innerRef}
                                                draggableProps={provided.draggableProps}
                                                dragHandleProps={provided.dragHandleProps}
                                            />

                                        )}

                                    </Draggable>

                                ))
                            }
                            {provided.placeholder}
                        </div>

                    )}
                </StrictModeDroppable>

                
            </DragDropContext>

        </section>
    )

}

export default CueList;