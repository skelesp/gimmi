export type wishStatus = 'Open' | 'Reserved' | 'Received' | 'Closed';

export class Wish {
    private _status: wishStatus;

    constructor(
        public id: string,
        public title: string,
        public price: number,
        public image: string,
        public url: string
    ) {
        if (!image) this.image = '<DEFAULT IMAGE>'
    }

    
    public set status (v : wishStatus) {
        this._status = v;
    }

    
    public get status() : wishStatus {
        return this._status;
    }
    
    
}
