import { databases } from "./config.js";
import { ID } from "appwrite";

const db = {};

const tables = [
    {
        dbId: import.meta.env.VITE_OPTIMA_DATABASE_ID_OPFILES,
        id: import.meta.env.VITE_OPTIMA_TABLE_ID_PROFILES,
        name: "profiles",
    },
];

tables.forEach(t => {
    db[t.name] = {
        create: (payload, permissions, id = ID.unique()) =>
            databases.createDocument(
                t.dbId,
                t.id,
                id,
                payload,
                permissions
            ),
        update: (id, payload, permissions) =>
            databases.updateDocument(
                t.dbId,
                t.id,
                id,
                payload,
                permissions
            ),
        delete: (id) => databases.deleteDocument(t.dbId, t.id, id),

        list: (queries = []) =>
            databases.listDocuments(t.dbId, t.id, queries),

        get: (id) => databases.getDocument(t.dbId, t.id, id),
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