type ProjectStruct = {

    name: string | undefined

}

export type SerializedProjectStruct = string;

export const serializeProjectStruct = (projectStruct: ProjectStruct) : SerializedProjectStruct => {

    return JSON.stringify(projectStruct);

}

export const deserializeProjectStruct = (serializedProjectStruct: SerializedProjectStruct) : ProjectStruct => {

    return JSON.parse(serializedProjectStruct) as ProjectStruct;

}

export const generateSerializedGenericProjectStruct = (projectName: string) : SerializedProjectStruct => {

    const genericProject: ProjectStruct = {
        name: projectName
    }

    return serializeProjectStruct(genericProject);

}

export default ProjectStruct;