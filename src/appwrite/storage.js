import { storage } from "./config.js";

const st = {};

const store = [
    {
        bId: import.meta.env.VITE_OPTIMA_BUCKET_ID_PFP,
        name: "pfp",
    }
]

store.forEach(s => {
    st[s.name] = {
        create: (id, file) => 
            storage.createFile(
                s.bId,
                id,
                file,
            ),
        retrieve: (id) => 
            storage.getFileView(
                s.bId,
                id,
            ),
        delete: (id) => 
            storage.deleteFile(
                s.bId,
                id
            ) 
    }
})

export default st;