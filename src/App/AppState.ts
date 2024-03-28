
// Project State

// namespace AppState {

//     export const addCue = () => {

//         cues.value = [...cues.value, { uuid: uuidv4(), name: "Some Name" }];

//     }

//     export const loadProjectIntoState = (projectStruct: ProjectStruct) => {

//         projectName.value = projectStruct.name;
//         cues.value = projectStruct.cueList;

//     }

//     export const redefineCue = (uuid: UUID, cue: Project.Cue) => {
        
//         const cueIndex = Project.getIndexByUUID(cues.value, uuid);

//         if(cueIndex !== -1) {

//             const updatedCues = [
//                 ...cues.value.slice(0, cueIndex),
//                 cue,
//                 ...cues.value.slice(cueIndex + 1)
//             ];

//             cues.value = updatedCues;

//         } else {
//             console.error("Could not find cue with UUID of: " + uuid + " in function redefineCue");
//         }

//     }
    
// }

// export default AppState;