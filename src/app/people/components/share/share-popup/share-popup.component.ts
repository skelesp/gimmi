import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Person } from 'src/app/people/models/person.model';

@Component({
  selector: 'gimmi-share-popup',
  templateUrl: './share-popup.component.html',
  styleUrls: ['./share-popup.component.css']
})
export class SharePopupComponent {
  @Input() linkToShare : string;
  @Input() personToShare : Person;
  
  message: string = 'Hey, op volgende link vind je mijn wensenlijst voor een cadeautje.';
  
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  generateMessage () : string {
    return encodeURIComponent(`${this.message} ${this.linkToShare}`);
  }

}
