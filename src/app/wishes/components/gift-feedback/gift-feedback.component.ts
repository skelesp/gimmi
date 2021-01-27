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
    public activeModal : NgbActiveModal,
    private wishService : WishService,
    private peopleService : PeopleService,
    private communicationService : CommunicationService
  ) { }

  ngOnInit(): void {
    this.giftFeedbackForm = new FormGroup({
      'satisfaction': new FormControl(null, [Validators.required]),
      'receivedOn': new FormControl(null, [Validators.required]),
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

    this.wishService.addGiftFeedback(this.wish, giftFeedback)
    .pipe(switchMap(wish => this.wishService.close(wish)) )
    .subscribe(wish => { 
          console.log(wish);
          this.activeModal.close();
          if (wish.giftFeedback.putBackOnList) this.wishService.copy();
          if (wish.giftFeedback.message) {
            this.peopleService.getEmailById(wish.reservation.reservedBy.id).subscribe( email => {
              this.communicationService.sendMail({
                to: email,
                subject: `[GIMMI] ${wish.receiver.fullName} bedankt je voor je cadeau!!`,
                html: `${wish.reservation.reservedBy.firstName} <br/><br/>
                      Je hebt onlangs op Gimmi het cadeau '${wish.title}' gereserveerd voor ${wish.receiver.fullName}. <br/>
                      Onlangs heb je dit cadeau afgegeven. Daarnet heeft ${wish.receiver.firstName} je een dankboodschap nagelaten:<br/><br/>
                      <em>${wish.giftFeedback.message}</em><br/><br/><br/>
                      Bedankt om Gimmi te gebruiken en hopelijk tot snel voor een nieuwe succesvolle cadeauzoektocht!`
              });
            })
          }
        }
      );
  }

}
