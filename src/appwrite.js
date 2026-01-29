import { Client, Databases} from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://nyc.cloud.appwrite.io/v1') // Replace with projects API endPoint
    .setProject('68a2c27b000a875ca982'); // Replace with project ID

export const databases = new Databases(client);