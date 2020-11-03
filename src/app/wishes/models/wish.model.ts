type wishStatus = 'open' | 'received';

export class Wish {
    public status: wishStatus;

    constructor(
        public id: string,
        public title: string,
        public price: number,
        public image: string,
        public url: string
    ) {
        this.status = 'open';
        if (!image) this.image = '<DEFAULT IMAGE>'
    }
}
