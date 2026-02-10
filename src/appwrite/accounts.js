import { account } from "./config.js";
import { ID } from "appwrite";

const user = {

    create: ({email, password, name}) => 
        account.create(
            ID.unique(),
            email,
            password,
            name
        ),
    
    login: ({email, password}) => 
        account.createEmailPasswordSession(email, password),

    logout: () => 
        account.deleteSession("current"),

    get: () =>
        account.get(),

    updateName: (name) => 
        account.updateName(name),

    updateEmail: (email, password) => 
        account.updateEmail(email, password),

    updatePassword: (newPassword, oldPassword) => 
        account.updatePassword(newPassword, oldPassword),

    createVer: (redirectUrl) => account.createEmailVerification(redirectUrl),
};

export default user;