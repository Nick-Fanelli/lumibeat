import { Signal } from "@preact/signals-react";

export const useSignalValue = <T>(signal: Signal<T>) : T => {

    return signal.value;

}