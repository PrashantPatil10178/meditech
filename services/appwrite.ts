// services/appwrite.ts
import { Client, Account, ID, Storage, Databases } from 'appwrite';

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject('67b9a28200344b28883b'); // Your Appwrite project ID

// Initialize the Account service
export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);

// Export ID for generating unique IDs
export { ID };
