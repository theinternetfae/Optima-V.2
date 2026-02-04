import { Client, Account, Databases } from "appwrite";

console.log("ENV:", import.meta.env);

const client = new Client()
    .setEndpoint(import.meta.env.VITE_OPTIMA_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_OPTIMA_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases }