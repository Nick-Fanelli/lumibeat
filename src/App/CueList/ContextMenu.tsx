import { useRef } from "react"

import './ContextMenu.css'
import useOnClickAway from "./useOnClickAway"

export interface ContextMenuItem {

    type: 'MenuItem'

    label: string
    
    onClick: () => void

}

export interface ContextMenuModifier {

    type: 'Separator'

}

interface ContextMenuProps {

    menuItems: (ContextMenuItem | ContextMenuModifier)[]

    x: number
    y: number

    closeContextMenu: () => void

}

const ContextMenuComponent: React.FC<ContextMenuProps> = ({ menuItems, x, y, closeContextMenu }) => {

    const contextMenuRef = useRef<HTMLDivElement>(null);

    useOnClickAway(contextMenuRef, closeContextMenu);

    return (
        <div 
            ref={contextMenuRef} 
            className="context-menu"
            style={{ top: `${y}px`, left: `${x}px` }}
        >

            <ul>
                {
                    menuItems.map((item, index) => {
                        
                        if(item.type === 'MenuItem') {
                            return (
                                <li key={index} onClick={item.onClick}>
                                    <div className="icon"></div>
                                    <p>{item.label}</p>
                                </li>
                            );
                        } else if(item.type === 'Separator') {
                            return (
                                <li key={index} className="separator">
                                    <div className="line"></div>
                                </li>
                            )
                        }
                    })
                }
            </ul>

        </div>
    )

}

export default ContextMenuComponent;