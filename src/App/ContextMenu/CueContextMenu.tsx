import { useRef } from "react"

import './CueContextMenu.css'
import useOnClickAway from "../CueList/useOnClickAway"

import { FaArrowDown, FaArrowUp, FaCopy, FaPaste, FaTrash } from "react-icons/fa"

import { Tooltip } from "react-tooltip"

interface QuickActionProps {

    title: string,

    onClick?: () => void
    closeContextMenu: () => void

    children: JSX.Element

}

const QuickAction = (props: QuickActionProps) => {

    return (

        <div className="quick-action"
            data-tooltip-id="quick-tray-tooltip"
            data-tooltip-content={props.title}
            onClick={() => {
                if(props.onClick)
                    props.onClick();

                props.closeContextMenu();
            }}
        >
            {props.children}
        </div>

    )

}

interface ContextMenuProps {

    x: number
    y: number

    closeContextMenu: () => void

    moveCueUp: () => void
    moveCueDown: () => void
    deleteCue: () => void
    
}

const CueContextMenu: React.FC<ContextMenuProps> = ({ x, y, closeContextMenu, deleteCue, moveCueUp, moveCueDown }) => {

    const contextMenuRef = useRef<HTMLDivElement>(null);

    useOnClickAway(contextMenuRef, closeContextMenu);

    return (
        <div 
            ref={contextMenuRef} 
            className="cue-context-menu"
            style={{ top: `${y}px`, left: `${x}px` }}
        >

            <div className="quick-tray">

                <Tooltip id="quick-tray-tooltip" />

                <div className="group">
                    <QuickAction title="Copy" closeContextMenu={closeContextMenu}>
                        <FaCopy className="icon" />
                    </QuickAction>
                    <QuickAction title="Paste" closeContextMenu={closeContextMenu}>
                        <FaPaste className="icon" />
                    </QuickAction>
                </div>

                <div className="group">
                    <QuickAction title="Move Cue Up" closeContextMenu={closeContextMenu} onClick={moveCueUp}>
                        <FaArrowUp className="icon" />
                    </QuickAction>

                    <QuickAction title="Move Cue Down" closeContextMenu={closeContextMenu} onClick={moveCueDown}>
                        <FaArrowDown className="icon" />
                    </QuickAction>
                </div>

                <div className="group">
                    <QuickAction title="Delete Cue" closeContextMenu={closeContextMenu} onClick={deleteCue}>
                        <FaTrash className="icon" />
                    </QuickAction>
                </div>

            </div>
        </div>
    )

}

export default CueContextMenu;