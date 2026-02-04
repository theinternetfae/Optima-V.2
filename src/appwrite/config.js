import { Client, Account, Databases } from "appwrite";

const client = Client()
    .setEndPoint(import.meta.env.OPTIMA_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.OPTIMA_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases }