import React, { ChangeEvent, useCallback, useEffect, useRef } from 'react'

import './HiddenInputComponent.css'

interface HandleInputComponentProps {

    type?: string

    value: any
    setValue?: (value: string) => void

    customValidation?: (value: string) => boolean

    shouldLiveUpdate?: boolean

    className?: string

}

const HiddenInputComponent = (props: HandleInputComponentProps) => {

    const ref = useRef<HTMLInputElement>(null);

    const changedValue = useRef<string | null>(null);

    const watchKeyInputForFocus = useCallback((e: KeyboardEvent) => {

        if(e.key === 'Enter') {
            ref?.current?.blur();
        }

    }, [ref.current]);

    const globalMouseDown = useCallback((e: MouseEvent) => {

        if(ref.current && e.target !== ref.current) {
            ref.current.blur();
        }

    }, [ref.current]);

    // Handle External Change of Value
    useEffect(() => {

        if(ref.current) {
            ref.current.value = props.value;
        }

    }, [props.value]);

    return (
        <input ref={ref} className={`hidden-input ${props.className}`} type={props.type || "text"} defaultValue={props.value} 
        
        onChange={(e: ChangeEvent<HTMLInputElement>) => {

            if(props.shouldLiveUpdate) {
                if(props.customValidation && !props.customValidation(e.currentTarget.value)) { // Invalid
                    return;
                }

                props.setValue ? props.setValue(e.currentTarget.value) : console.warn("props.setValue should be defined");
            }
            else
                changedValue.current = e.currentTarget.value;
        }} 
        
        onMouseDown={(e) => {
            if(document.activeElement !== ref.current) {
                e.preventDefault();
            }
        }}
        
        onDoubleClick={(e: React.MouseEvent<HTMLInputElement>) => {
            e.currentTarget.select();
        }}

        onFocus={() => {
            document.addEventListener("keydown", watchKeyInputForFocus);
            document.addEventListener('mousedown', globalMouseDown);
        }}
        
        onBlur={(e) => {

            if(!props.shouldLiveUpdate && changedValue.current !== null) {
                if(!props.customValidation || props.customValidation(changedValue.current))
                    props.setValue ? props.setValue(changedValue.current) : console.warn("props non-live update didn't work");
                else {
                    e.currentTarget.value = props.value;
                    changedValue.current = null;
                }
            }

            document.removeEventListener("keydown", watchKeyInputForFocus);
            document.removeEventListener('mousedown', globalMouseDown);
        }}

        />
    )

}

export default HiddenInputComponent;