import { Person } from 'src/app/people/models/person.model';
import { environment } from 'src/environments/environment';

export type wishStatus = 'Open' | 'Reserved' | 'Received' | 'Closed';

export interface ICloudinaryImage {
    publicId: string,
    version: string
}
export class Wish {
    private _status: wishStatus;

    constructor(
        public id: string,
        public title: string,
        public price: number,
        public image: ICloudinaryImage,
        public url: string,
        public receiver: Person,
        public createdBy: Person
    ) {
        if (!image) this.image = environment.cloudinary.defaultImage
    }

    
    public set status (v : wishStatus) {
        this._status = v;
    }

    
    public get status() : wishStatus {
        return this._status;
    }
    
    
}
