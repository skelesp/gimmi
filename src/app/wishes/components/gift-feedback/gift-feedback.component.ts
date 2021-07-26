import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { switchMap} from 'rxjs/operators';
import { PeopleService } from 'src/app/people/service/people.service';
import { CommunicationService } from 'src/app/shared/services/communication.service';

import { IGiftFeedback, Wish } from '../../models/wish.model';
import { WishService } from '../../services/wish.service';

@Component({
  selector: 'gimmi-gift-feedback',
  templateUrl: './gift-feedback.component.html',
  styleUrls: ['./gift-feedback.component.css']
})
export class GiftFeedbackComponent implements OnInit {
  @Input() wish: Wish;
  giftFeedbackForm : FormGroup;
  hoveredRate: number;
  selectedRate: number;
  satisfactionLevels: string[] = ['Duid je tevredenheid aan...','Helemaal niet blij', 'Niet blij', 'Neutraal', 'Blij', 'Heel blij'];
  ratingIcon = faThumbsUp;
  maxDate: string = new Date().toISOString().slice(0, 10);

  constructor( 
    public activeModal : NgbActiveModal
  ) { }

  ngOnInit(): void {
    let defaultReceivedDate = new Date(this.wish.reservation.reservationDate).toISOString().slice(0, 10);
    this.giftFeedbackForm = new FormGroup({
      'satisfaction': new FormControl(null, [Validators.required]),
      'receivedOn': new FormControl( defaultReceivedDate, [Validators.required]),
      'message': new FormControl(null),
      'putBackOnList': new FormControl(false)
    });
  }

  saveGiftFeedback() {
    let giftFeedback: IGiftFeedback = {
      satisfaction: this.satisfactionLevels[this.giftFeedbackForm.value.satisfaction],
      receivedOn: this.giftFeedbackForm.value.receivedOn,
      message: this.giftFeedbackForm.value.message,
      putBackOnList: this.giftFeedbackForm.value.putBackOnList
    };

    this.activeModal.close(giftFeedback);
  }

}
