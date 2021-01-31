import { Component, Input, OnInit } from '@angular/core';
import { Wish, WishScenario } from '../../models/wish.model';
import { faEllipsisV, faBan, faGift } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WishReservationComponent } from '../wish-reservation/wish-reservation.component';
import { ChangeWishReservationComponent } from '../wish-reservation/change-wish-reservation/change-wish-reservation.component';
import { GiftFeedbackComponent } from '../gift-feedback/gift-feedback.component';
import { CTAButtonConfig } from './wish-call-to-action-button/wish-call-to-action-button.component';

@Component({
  template: '',
  styleUrls: ['./wish-item.component.css']
})
export class WishItemComponent implements OnInit {
  @Input() wish: Wish;
  faEllipsisV = faEllipsisV;
  config: CTAButtonConfig = { text: null, icon: null };

  readonly CTAbuttonConfigs: { [key: string]: CTAButtonConfig } = {
    noButton: { text: null, icon: null },
    reserve: { text: "Reserveer", icon: faGift, onClick: this.reserve.bind(this) },
    cancel: { text: "Verwijder reservatie", icon: faBan, onClick: this.changeReservation.bind(this) },
    feedback: { text: "Geef feedback", icon: faComment, onClick: this.giveFeedback.bind(this) }
  }

  readonly scenarioButtonMapping: { [key in WishScenario]: CTAButtonConfig } = {
    'OPEN_WISH': this.CTAbuttonConfigs.reserve,
    'OPEN_WISH_CREATED_BY_USER_FOR_ANOTHER': this.CTAbuttonConfigs.reserve,
    'RESERVED': this.CTAbuttonConfigs.noButton,
    'RESERVED_BY_USER': this.CTAbuttonConfigs.cancel,
    'RESERVED_INCOGNITO_FOR_USER': this.CTAbuttonConfigs.reserve,
    'RECEIVED': this.CTAbuttonConfigs.noButton,
    'RECEIVED_RECEIVER': this.CTAbuttonConfigs.feedback,
    'RECEIVED_GIVEN_BY_USER': this.CTAbuttonConfigs.noButton,
    'FULFILLED': this.CTAbuttonConfigs.noButton,
    'FULFILLED_BY_USER': this.CTAbuttonConfigs.noButton
  };

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {}

  blurWishCardStatus() : boolean {
    return !(this.wish.scenario === 'RESERVED_INCOGNITO_FOR_USER' || this.wish.scenario === 'OPEN_WISH_CREATED_BY_USER_FOR_ANOTHER' || this.wish.scenario === 'OPEN_WISH');
  }
  
  reserve() {
    let reservationPopup = this.modalService.open(WishReservationComponent);
    reservationPopup.componentInstance.wish = this.wish;
  }

  changeReservation() {
    let cancelReservationPopup = this.modalService.open(ChangeWishReservationComponent);
    cancelReservationPopup.componentInstance.wish = this.wish;
  }

  giveFeedback() {
    let giftFeedbackPopup = this.modalService.open(GiftFeedbackComponent);
    giftFeedbackPopup.componentInstance.wish = this.wish;
  }
  
  edit () {
    window.alert(`editwish: ${this.wish.title}`);
  }

  copy() {
    window.alert(`Copy wish: ${this.wish.title}`);
  }

  delete() {
    window.alert(`Delete wish: ${this.wish.title}`);
  }

}
