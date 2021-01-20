import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    private wishService : WishService 
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
    this.wishService.addGiftFeedback( this.wish, giftFeedback ).subscribe(
      wish => { 
        console.log(wish);
        this.activeModal.close();
      }
    );
  }

}
