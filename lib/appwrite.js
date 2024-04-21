import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.shadwal.aora',
    projectId: '662332f354db49e6c158',
    databaseId: '66233475ae72c85d6032',
    userCollectionId: '662334adc8dde9261176',
    videoCollectionId: '662334ee7e9183df2aca',
    storageId: '662336cc9058acc8dd7a',
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;

// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) 
    .setProject(config.projectId) 
    .setPlatform(config.platform)

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);

    export const createUser = async (email, password, username) => {
        try {
            const newAccount = await account.create(
                ID.unique(),
                email,
                password,
                username,
            )

            if(!newAccount) throw Error;

            const avatarUrl = avatars.getInitials(username)

            await signIn(email, password);

            const newUser = await databases.createDocument(
                config.databaseId,
                config.userCollectionId,
                ID.unique(),
                {
                    accountId: newAccount.$id,
                    email,
                    username,
                    avatar: avatarUrl
                }
            )

            return newUser;

        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    export const  signIn = async (email, password) => {
        try {
            const session = await account.createEmailSession(email, password)

            return session;
            
        } catch (error) {
            throw new Error(error);
        }
    }

    export const getCurrentUser = async () => {
        try {
            const currentAccount = await account.get();

            if(!currentAccount) throw Error;

            const currentUser = await databases.listDocuments(
                config.databaseId,
                config.userCollectionId,
                [Query.equal('accountId', currentAccount.$id)]
            )

            if(!currentUser) throw Error;

            return currentUser.documents[0];
        } catch (error) {
            console.log(error);
        }
    }

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}