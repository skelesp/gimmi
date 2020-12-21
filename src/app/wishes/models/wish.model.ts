import { Person } from 'src/app/people/models/person.model';
import { environment } from 'src/environments/environment';

export type wishStatus = 'Open' | 'Reserved' | 'Received' | 'Fulfilled';

export interface ICloudinaryImage {
    publicId: string,
    version: string
}

export interface IReservation {
    reservedBy: Person;
    amount: number;
    reservationDate: Date;
    reason: string;
    handoverDate?: Date;
}

export interface IGiftFeedback {
    satisfaction: string;
    receivedOn: Date;
    message: string;
    putBackOnList: boolean;
}

export interface IClosure {
    closedBy: Person;
    closedOn: Date;
    reason: string;
}
export class Wish {
    private _status: wishStatus;
    public reservation: IReservation;
    public giftFeedback: IGiftFeedback;
    public closure: IClosure;
    public copyOf: string;

    constructor(
        public id: string,
        public title: string,
        public price: number,
        public image: ICloudinaryImage,
        public url: string,
        public receiver: Person,
        public createdBy: Person,
        public color: string,
        public size: string,
        public description: string,
        public amountWanted: number
    ) {
        if (!image) this.image = environment.cloudinary.defaultImage;
    }
    
    public set status (v : wishStatus) {
        this._status = v;
    }
    
    public get status() : wishStatus {
        return this._status;
    }
    
    
}
