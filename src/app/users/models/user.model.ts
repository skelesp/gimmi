export class User {
    constructor(
        public id: string,
        public lastName: string,
        public firstName: string,
        public email: string,
        public loginStrategy: string,
        public token: string,
        public accounts: any
    ) { };

    get fullName(): string { // TODO: User should extend Person so this duplication isn't needed anymore (name should come from Person class, not User Class)
        return `${this.firstName} ${this.lastName}`;
    }
}

export interface ILocalLoginInfo {
    email: string,
    password: string
}

export interface IFacebookUserInfo { //Zie SocialUser class van angularx-social-login
    provider: string;
    id: string;
    authToken: string;
    photoUrl: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface IDecodedUserToken {
    _id: string;
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    birthday: string;
    exp: number;
    iat: number;
    loginStrategy: string;
    accounts: any[];
}