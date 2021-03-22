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
    public _id : string;

    constructor (
        public id: string,
        public firstName: string,
        public lastName: string
    ) { 
        this._id = id;
    };

    get fullName () : string {
        return `${this.firstName} ${this.lastName}`;
    }
};