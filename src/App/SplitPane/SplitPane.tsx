import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './SplitPane.css'

type Props = {

    children: React.ReactElement[]

}

const MIN_MAX_PERCENTAGE = 15; // percent

const SplitPane = (props: Props) => {

    const splitPaneRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [divPercentage, setDivPercentage] = useState<number>(60);

    const handleMouseUp = useCallback(() => {

        setIsDragging(false);

    }, [setIsDragging]);

    const handleDividerClick = useCallback(() => {

        setIsDragging(true);

        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        }

    }, [setIsDragging]);

    useEffect(() => {

        const handleDrag = (e: MouseEvent) => {

            if(isDragging && splitPaneRef.current) {

                const totalHeight = splitPaneRef.current.getBoundingClientRect().height;
                const mouseY = e.clientY - splitPaneRef.current.getBoundingClientRect().top;

                const newPercentage = (mouseY / totalHeight) * 100;

                const clampedPercentage = Math.min(100 - MIN_MAX_PERCENTAGE, Math.max(MIN_MAX_PERCENTAGE, newPercentage));

                setDivPercentage(clampedPercentage);
            }

        }

        if(isDragging) {
            document.addEventListener('mousemove', handleDrag);
        } else {
            document.removeEventListener('mousemove', handleDrag);
        }

        return () => {
            document.removeEventListener('mousemove', handleDrag);
        }

    }, [isDragging, setDivPercentage]);

    useLayoutEffect(() => {

        document.removeEventListener('mouseup', handleMouseUp);

    }, []);

    return (

        <div className="split-pane" ref={splitPaneRef}>

            <div className="pane" style={{ height: `${divPercentage}%` }}>
                {props.children[0]}
            </div>

            <div className="divider" onMouseDown={handleDividerClick}>
                <div />
            </div>

            <div className="pane" style={{ height: `${100 - divPercentage}%` }}>
                {props.children[1]}
            </div>

        </div>

    )
    
}

export default SplitPane;