import { useEffect, useState } from 'react'
import './Path.css'

type Props = {

    path?: string

};

const Path = (props: Props) => {

    const [path, setPath] = useState<string | undefined>();

    useEffect(() => {

        setPath(props.path);

    }, [props.path, setPath]);

    return (
        <div className="path-chooser">
            <p>{path}</p>
            <div className="arrow">
                <p>&lt;</p>
            </div>
        </div>
    )

}

export default Path;