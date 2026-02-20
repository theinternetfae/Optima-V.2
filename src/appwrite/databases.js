import { databases } from "./config.js";
import { ID } from "appwrite";

const db = {};

const database = [
    {
        dbId: import.meta.env.VITE_OPTIMA_DATABASE_ID_OPFILES,
        id: import.meta.env.VITE_OPTIMA_TABLE_ID_PROFILES,
        name: "profiles",
    },
    {
        dbId: import.meta.env.VITE_OPTIMA_DATABASE_ID_OPFILES,
        id: import.meta.env.VITE_OPTIMA_TABLE_ID_TASKS,
        name: "tasks",
    },
];

database.forEach(d => {
    db[d.name] = {
        create: (payload, permissions, id = ID.unique()) =>
            databases.createDocument(
                d.dbId,
                d.id,
                id,
                payload,
                permissions
            ),
        update: (id, payload, permissions) =>
            databases.updateDocument(
                d.dbId,
                d.id,
                id,
                payload,
                permissions
            ),
        delete: (id) => databases.deleteDocument(d.dbId, d.id, id),

        list: (queries = []) =>
            databases.listDocuments(d.dbId, d.id, queries),

        get: (id) => databases.getDocument(d.dbId, d.id, id),
    };
});

export default db;


// export async function addUser({fname, lname, email}) {
    
//     const newProfile = {
//         fname: fname,
//         lname: lname,
//         email: email,
//     }

//     const response = await databases.createDocument(
//         'optima', // Project name
//         'users', // Table/Collection name
//         ID.unique(), //AppWrite generated ID for each instance
//         newProfile
//     )

//     return response;

// }

// export async function getUser() {
//     const response = await databases.listDocuments(
//         'optima',
//         'users',        
//     )

//     console.log(response.documents)

//     const notes = response.documents.map(doc => ({
//         $id: doc.$id,
//         $createdAt: doc.$createdAt,
//         fname: doc.fname,
//         lname: doc.lname,
//         email: doc.email
//     }))

//     return notes;
// }

// export async function deleteUser(userId) {
    
//     await databases.deleteDocument(
//         'optima',
//         'users',
//         userId
//     )

// }



// db.profiles = {
//   create(payload),
//   update(id, payload),
//   delete(id),
//   list(),
//   get(id)
// }
