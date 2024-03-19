import { Signal } from "@preact/signals-react"
import Project, { UUID } from "../../Project/Project";
import { useState } from "react";
import DropTarget from "../DragDrop/DropTarget";
import Draggable from "../DragDrop/Draggable";
import HiddenInputComponent from "../HiddenInputComponent/HiddenInputComponent";
import ContextMenuComponent from "./ContextMenu";

type CueComponentProps = {

    cues: Signal<Project.Cue[]>,
    cueSelection: Signal<string[]>,

    moveCue: (sourceUUID: UUID, sourceIndex: number, destinationIndex: number) => void,
    reportOnCueClick: (event: React.MouseEvent, uuid: UUID) => void,
    deleteCue: (uuid: UUID) => void,

    cue: Project.Cue,
    index: number

}

type ContextMenuData = {

    isVisible: boolean,

    x: number,
    y: number

}

const CueComponent = ({ cues, cueSelection, moveCue, reportOnCueClick, deleteCue, cue, index }: CueComponentProps) => {

    const [ contextMenu, setContextMenu ] = useState<ContextMenuData>({ isVisible: false, x: 0, y: 0 });

    const updateCueByUUID = (uuid: UUID, cueCallback: (cue: Project.Cue) => Project.Cue) => {

        const targetCueIndex = cues.value.findIndex((cue) => cue.uuid === uuid);

        if(targetCueIndex != -1) {
            const updatedCues = [...cues.value];
            updatedCues[targetCueIndex] = cueCallback(cues.value[targetCueIndex]);
            cues.value = updatedCues;
        }

    } 

    const handleContextMenu = (event: React.MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>) => {

        event.preventDefault();

        const yDiff = 120;

        const { pageX, pageY } = event;
        setContextMenu({ isVisible: true, x: pageX, y: pageY - yDiff });

    }

    const closeContextMenu = () => setContextMenu({ isVisible: false, x: 0, y: 0 });

    return (
        <DropTarget key={cue.uuid + "drop-target"} acceptOnly={['cue']}
            onDrop={(dropID, dropData) => {
                console.log("DROP");

                if(dropID === 'cue') {
                    moveCue(dropData.uuid, dropData.index, index);
                }
            }}

            ruleOnValidationString={(validationString) => {
                const targetIndex: number = +validationString;
                return (targetIndex !== index) && (targetIndex !== index + 1)
            }}
        >
            {(dropTargetProvided, dropTargetSnapshot) => (
                <Draggable
                    key={cue.uuid.toString() + '-draggable'}
                    dragID='cue'
                    dropData={{ uuid: cue.uuid, index }}
                    validationString={index.toString()}
                    customCreateDraggableElement={() => {
                        let element = document.createElement('div');

                        let content: string = (cue.number ? `${cue.number}. ` : '') + (cue.name !== null ? cue.name : '');

                        if(!content || content.trim().length === 0)
                            content = "Unnamed Cue";

                        element.innerHTML = `
                            <p style="
                                background-color: var(--background-color);
                                flex: 0 1 auto;
                                padding: 3px 0.5em;
                                border-radius: 5px;
                                box-shadow: 0px 0px 0px rgba(0,0,0,1);
                                overflow: visible;
                                opacity: 1;
                                border: solid 2px #101010;
                            ">${content}</p>
                        `;

                        element.style.cssText = `
                            display: flex;
                            overflow: visible;
                            opacity: 1;
                            position: absolute;
                            top: -100%;
                            left: 0;
                        `

                        element.setAttribute('key', cue.uuid.toString() + '-custom-draggable-element');

                        return element;

                    }}
                >
                    {(provided, snapshot) => ([
                        <>
                            <tr
                                key={cue.uuid + 'cue-elm'}
                                className={`${cueSelection.value.includes(cue.uuid) ? 'selected' : ''} ${index % 2 !== 0 ? 'odd' : ''} ${snapshot.isBeingDragged ? 'beingDragged' : ''}`}
                                onClick={(event) => { reportOnCueClick(event, cue.uuid) }}
                                {...provided}
                                {...dropTargetProvided}

                                onContextMenu={ (event) => handleContextMenu(event) }
                            >
                                <td className="info" style={{ width: "100px" }}>
                                    <div className="machine-id"></div>
                                    <div className="machine-highlight"></div>
                                </td>
                                <td className="cue-number" style={{ width: "100px" }}>
                                    <HiddenInputComponent type="number" value={cue.number || ""} setValue={(newValue: string) => {
                                        updateCueByUUID(cue.uuid, (prevCue) => {
                                            return {
                                                ...prevCue,
                                                number: newValue.length === 0 ? undefined : +newValue
                                            }
                                        })
                                    }} />
                                </td>
                                <td>
                                    <HiddenInputComponent value={cue.name || ""} setValue={(newValue: string) => {
                                        updateCueByUUID(cue.uuid, (prevCue) => {
                                            return {
                                                ...prevCue,
                                                name: newValue
                                            }
                                        })
                                    }} />
                                </td>
                                <td>{cue.name} {cue.number}</td>
                            </tr>
                            {
                                contextMenu.isVisible && <ContextMenuComponent

                                        x={contextMenu.x}
                                        y={contextMenu.y}

                                        closeContextMenu={closeContextMenu}

                                        menuItems={[

                                            {
                                                type: 'MenuItem', label: "Copy", onClick: () => {

                                                }
                                            },

                                            {
                                                type: 'MenuItem', label: "Paste After", onClick: () => {

                                                }
                                            },

                                            {
                                                type: "Separator"
                                            },

                                            { type: 'MenuItem', label: "Delete", onClick: () => {
                                                deleteCue(cue.uuid);
                                                closeContextMenu();
                                            }}

                                        ]}

                                />
                            }
                        </>,
                        dropTargetSnapshot.isDraggedOver ?
                        <tr className="light" key={cue.uuid + 'cue-light'}></tr>
                        : null
                    ])}
                </Draggable>
            )}
            
        </DropTarget>
    )

}

export default CueComponent;