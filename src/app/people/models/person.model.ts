export interface IPerson {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
}

export interface IPersonSearchResponse extends IPerson {
    _id: string;
}
export class Person implements IPerson{
    constructor (
        public id: string,
        public firstName: string,
        public lastName: string
    ) { };

    get fullName () : string {
        return `${this.firstName} ${this.lastName}`;
    }
};