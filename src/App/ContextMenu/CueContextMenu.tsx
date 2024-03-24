import { useCallback, useRef, useState } from "react"

import './CueContextMenu.css'
import useOnClickAway from "../CueList/useOnClickAway"

import { FaArrowDown, FaArrowUp, FaCopy, FaPaste, FaRegSquare, FaTrash } from "react-icons/fa"

interface QuickActionProps {

    title: string,

    onClick?: () => void
    closeContextMenu: () => void

    reportOnHint: (hintTitle: string | undefined) => void
    children: JSX.Element

}

const QuickAction = (props: QuickActionProps) => {

    return (

        <div className="quick-action"
            onMouseEnter={() => props.reportOnHint(props.title)}
            onMouseLeave={() => props.reportOnHint(undefined)}
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

    const [ hint, setHint ] = useState<string | undefined>(undefined);

    const contextMenuRef = useRef<HTMLDivElement>(null);

    useOnClickAway(contextMenuRef, closeContextMenu);

    const reportOnHint = useCallback((hintTitle: string | undefined) => {

        setHint(hintTitle)

    }, [setHint]);

    return (
        <div 
            ref={contextMenuRef} 
            className="cue-context-menu"
            style={{ top: `${y}px`, left: `${x}px` }}
        >

            <div className="quick-tray">

                <div className="group">
                    <QuickAction title="Copy" reportOnHint={reportOnHint} closeContextMenu={closeContextMenu}>
                        <FaCopy className="icon" />
                    </QuickAction>
                    <QuickAction title="Paste" reportOnHint={reportOnHint} closeContextMenu={closeContextMenu}>
                        <FaPaste className="icon" />
                    </QuickAction>
                </div>

                <div className="group">
                    <QuickAction title="Move Cue Up" reportOnHint={reportOnHint} closeContextMenu={closeContextMenu} onClick={moveCueUp}>
                        <FaArrowUp className="icon" />
                    </QuickAction>

                    <QuickAction title="Move Cue Down" reportOnHint={reportOnHint} closeContextMenu={closeContextMenu} onClick={moveCueDown}>
                        <FaArrowDown className="icon" />
                    </QuickAction>
                </div>

                <div className="group">
                    <QuickAction title="Delete Cue" reportOnHint={reportOnHint} closeContextMenu={closeContextMenu} onClick={deleteCue}>
                        <FaTrash className="icon" />
                    </QuickAction>
                </div>

            </div>

            <div className="divider"></div>

            <ul className={`options ${hint ? "blur" : ""}`}>
                <div className={`popup-tooltip ${hint ? "active" : ""}`}>
                    <h1>{hint}</h1>
                </div>

                <li>
                    <FaRegSquare className="icon" />
                    <h1>Bypass Cue</h1>
                </li>
            </ul>
           
        </div>
    )

}

export default CueContextMenu;