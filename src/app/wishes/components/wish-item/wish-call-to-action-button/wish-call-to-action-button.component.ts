import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faBan, faGift } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Wish, WishScenario } from 'src/app/wishes/models/wish.model';
import { GiftFeedbackComponent } from '../../gift-feedback/gift-feedback.component';
import { ChangeWishReservationComponent } from '../../wish-reservation/change-wish-reservation/change-wish-reservation.component';
import { WishReservationComponent } from '../../wish-reservation/wish-reservation.component';

interface CTAButtonConfig {
  text: string;
  icon: IconDefinition;
  onClick?: () => void;
}
@Component({
  selector: 'gimmi-wish-call-to-action-button',
  templateUrl: './wish-call-to-action-button.component.html',
  styleUrls: ['./wish-call-to-action-button.component.css']
})
export class WishCallToActionButtonComponent implements OnInit, OnChanges {
  @Input() wish : Wish;
  config: CTAButtonConfig = { text: null, icon: null };
  
  readonly buttonConfigs: { [key:string] : CTAButtonConfig} = {
    noButton: { text: null, icon: null },
    reserve: { text: "Reserveer", icon: faGift, onClick: this.reserve.bind(this) },
    cancel: { text: "Verwijder reservatie", icon: faBan, onClick: this.changeReservation.bind(this) },
    feedback: { text: "Geef feedback", icon: faComment, onClick: this.giveFeedback.bind(this) }
  } 

  readonly scenarioButtonMapping: { [key in WishScenario]: CTAButtonConfig } = {
    'OPEN_WISH': this.buttonConfigs.reserve,
    'OPEN_WISH_CREATED_BY_USER_FOR_ANOTHER': this.buttonConfigs.reserve,
    'RESERVED': this.buttonConfigs.noButton,
    'RESERVED_BY_USER': this.buttonConfigs.cancel,
    'RESERVED_INCOGNITO_FOR_USER': this.buttonConfigs.reserve,
    'RECEIVED': this.buttonConfigs.noButton,
    'RECEIVED_RECEIVER': this.buttonConfigs.feedback,
    'RECEIVED_GIVEN_BY_USER': this.buttonConfigs.noButton,
    'FULFILLED': this.buttonConfigs.noButton,
    'FULFILLED_BY_USER': this.buttonConfigs.noButton
  };

  constructor( 
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.config = this.scenarioButtonMapping[this.wish.scenario];
  }

  ngOnChanges(): void {
    this.config = this.scenarioButtonMapping[this.wish.scenario];    
  }

  reserve () {
    let reservationPopup = this.modalService.open(WishReservationComponent);
    reservationPopup.componentInstance.wish = this.wish;
  }

  changeReservation() {
    let cancelReservationPopup = this.modalService.open(ChangeWishReservationComponent);
    cancelReservationPopup.componentInstance.wish = this.wish;
  }

  giveFeedback(){
    let giftFeedbackPopup = this.modalService.open(GiftFeedbackComponent);
    giftFeedbackPopup.componentInstance.wish = this.wish;
  }

}
