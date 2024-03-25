namespace EntryPointGlobalConfigurations {

    export const runConfigurations = () => {

        // TODO: UPDATE WITH CUSTOM IS DEV API
        if(window.location.host.startsWith('localhost:'))
            return;

        document.addEventListener('contextmenu', e => {
            e.preventDefault();
            return false;
        }, { capture: true });
        
        document.addEventListener('selectstart', e => {
            e.preventDefault();
            return false;
        }, { capture: true });

    }

}

export default EntryPointGlobalConfigurations;