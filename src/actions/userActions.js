import { databases } from "../appwrite.js";
import { ID } from "appwrite";

export async function addUser({fname, lname, email}) {
    
    const newProfile = {
        fname: fname,
        lname: lname,
        email: email,
        theme: theme,
        accent: accent,
        optimaQuirk: optimaQuirk
    }

    const response = await databases.createDocument(
        'optima', // Project name
        'users', // Table/Collection name
        ID.unique(), //AppWrite generated ID for each instance
        newProfile
    )

    return response;

}