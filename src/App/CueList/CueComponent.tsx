import { useState } from "react";
import DropTarget from "../DragDrop/DropTarget";
import Draggable from "../DragDrop/Draggable";
import HiddenInputComponent from "../HiddenInputComponent/HiddenInputComponent";
import CueContextMenu from "../ContextMenu/CueContextMenu";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../State/AppStore";
import { setCueList } from "../State/Slices/cueListSlice";
import { setSelectedCues } from "../State/Slices/selectedCuesSlice";
import { Cue, UUID } from "../../Project/Project";

type CueComponentProps = {

    moveCue: (sourceIndex: number, destinationIndex: number) => void,
    reportOnCueClick: (event: React.MouseEvent, uuid: UUID) => void,
    deleteCue: (uuid: UUID) => void,

    cue: Cue,
    index: number

}

type ContextMenuData = {

    isVisible: boolean,

    x: number,
    y: number

}

const CueComponent = ({ moveCue, reportOnCueClick, deleteCue, cue, index }: CueComponentProps) => {

    const dispatch = useDispatch();
    
    const selectedCues = useSelector((state: AppState) => state.selectedCues.value);
    const cueList = useSelector((state: AppState) => state.cueList.value);

    const [ contextMenu, setContextMenu ] = useState<ContextMenuData>({ isVisible: false, x: 0, y: 0 });

    const updateCueByUUID = (uuid: UUID, cueCallback: (cue: Cue) => Cue) => {

        const targetCueIndex = cueList.findIndex((cue) => cue.uuid === uuid);

        if(targetCueIndex != -1) {
            const updatedCues = [...cueList];
            updatedCues[targetCueIndex] = cueCallback(cueList[targetCueIndex]);
            dispatch(setCueList(updatedCues));
        }

    } 

    const handleContextMenu = (event: React.MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>) => {

        event.preventDefault();

        const { pageX, pageY } = event;
        dispatch(setSelectedCues([ cue.uuid ]));
        setContextMenu({ isVisible: true, x: pageX, y: pageY });

    }

    const closeContextMenu = () => setContextMenu({ isVisible: false, x: 0, y: 0 });

    return (
        <DropTarget key={`drop-target@${cue.uuid}`} acceptOnly={['cue']}
            onDrop={(dropID, dropData) => {
                if(dropID === 'cue') {
                    moveCue(dropData.index, index);
                }
            }}

            ruleOnValidationString={(validationString) => {
                const targetIndex: number = +validationString;
                return (targetIndex !== index) && (targetIndex !== index + 1)
            }}
        >
            {(dropTargetProvided, dropTargetSnapshot) => (
                <Draggable
                    key={`draggable&${cue.uuid}`}
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

                        element.setAttribute('key', `custom-draggable-element@${cue.uuid.toString()}`);

                        return element;

                    }}
                >
                    {(provided, snapshot) => ([
                        <tr
                            key={`cue-elem@${cue.uuid}`}
                            className={`${selectedCues.includes(cue.uuid) ? 'selected' : ''} ${index % 2 !== 0 ? 'odd' : ''} ${snapshot.isBeingDragged ? 'beingDragged' : ''}`}
                            onClick={(event) => { reportOnCueClick(event, cue.uuid) }}
                            {...provided}
                            {...dropTargetProvided}

                            onContextMenu={ (event) => handleContextMenu(event) }
                        >
                            <td className="info" style={{ width: "100px" }}>
                                <div className="machine-id" data-tooltip-id="cue-uuid" data-tooltip-content={cue.uuid}></div>
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
                        </tr>,

                        contextMenu.isVisible && <CueContextMenu

                            x={contextMenu.x}
                            y={contextMenu.y}

                            moveCueUp={() => {
                                if(index > 0)
                                    moveCue(index, index - 1)
                            }}

                            moveCueDown={() => {
                                if(index < cueList.length - 1)
                                    moveCue(index, index + 1);
                            }}

                            deleteCue={() => deleteCue(cue.uuid)}
                                
                            closeContextMenu={closeContextMenu}

                        />,
                        
                        dropTargetSnapshot.isDraggedOver ?
                            <tr className="light" key={`cue-light@${cue.uuid}`}></tr>
                        : null
                    ])}
                </Draggable>
            )}
            
        </DropTarget>
    )

}

export default CueComponent;