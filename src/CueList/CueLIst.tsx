import { LegacyRef, useCallback, useState } from 'react';
import { DragDropContext, Draggable, DropResult, DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps, } from 'react-beautiful-dnd';
import './CueList.css'
import { StrictModeDroppable } from './StrictModeDroppable';

type Cue = {

    id: string
    name?: string
    selected: boolean

}

const initialCues: Cue[] = [

    { id: "0", name: "Hello World", selected: true },
    { id: "1", name: "Hello World 2", selected: false },
    { id: "2", name: "Hello World 3", selected: false }

];

type CueProps = {

    cue: Cue
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

const CueList = () => {

    const [cues, setCues] = useState(initialCues);

    const onDragEnd = useCallback((result: DropResult) => {
        
        setCues((prev) => {

            if (!result.destination) 
                return prev;
            
            const reorderedItems = Array.from(prev);
            const [movedItem] = reorderedItems.splice(result.source.index, 1);
            reorderedItems.splice(result.destination.index, 0, movedItem);

            return reorderedItems;

        });

    }, [setCues]);

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
                                cues.map((item, index) => (

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