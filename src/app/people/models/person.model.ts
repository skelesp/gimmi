export interface IPersonResponse extends IPerson {
    _id: string;
}

export interface IPerson {
    id: string;
    firstName: string;
    lastName: string;
    fullName?: string;
}

export class Person {
    constructor (
        public id: string,
        public firstName: string,
        public lastName: string
    ) { };

    get fullName () : string {
        return `${this.firstName} ${this.lastName}`;
    }
};