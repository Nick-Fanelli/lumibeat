import { Signal } from "@preact/signals-react";
import { useEffect } from "react";

const useSignalSubscribe = <T>(signal: Signal<T>, callback: (value: T) => void) => {

    useEffect(() => {

        const unsubscribe = signal.subscribe((value: T) => { callback(value); });

        return () => { unsubscribe(); }

    }, [signal]);

}

export default useSignalSubscribe;