export class User {
    constructor(
        public id: string,
        public lastName: string,
        public firstName: string,
        public email: string,
        public loginStrategy: string,
        public token: string,
        public accounts: any
    ) { }
}

export interface IPasswordResetRequest {
    email: string,
    resetPasswordRoute: string
}

export interface INewUserRequestInfo {
    firstname: string,
    lastname: string,
    email: string,
    birthday: string,
    password: string
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

export interface IValidatePasswordResetTokenResponse {
    firstName: string;
    token: string;
    expiresOn: Date;
}