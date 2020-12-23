export interface ILike {
    text: string;
    url: string;
}

export interface IExtraPersonInfo {
    likes: ILike[];
    dislikes: ILike[];
}

export class Person {
    public extraInfo: IExtraPersonInfo;
    public birthday: Date;

    constructor (
        public id: string,
        public firstName: string,
        public lastName: string
    ) { };

    get fullName () : string {
        return `${this.firstName} ${this.lastName}`;
    }
};