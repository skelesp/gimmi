export interface ILike {
    text: string;
    url: string;
}

export interface IExtraPersonInfo {
    likes: ILike[];
    dislikes: ILike[];
}

export interface IPerson {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    extraInfo?: IExtraPersonInfo;
    birthday?: Date;
}

export interface IPersonSearchResponse extends IPerson {
    _id: string;
}
export class Person implements IPerson{
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