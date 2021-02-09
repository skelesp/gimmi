import { Component, Input, OnInit } from '@angular/core';
import { Wish, WishScenario } from '../../models/wish.model';
import { faBan, faGift, faStar, faLightbulb, faCartArrowDown, faThumbsUp, faTrashAlt, faGlobeEurope } from '@fortawesome/free-solid-svg-icons';
import { faClone, faComment, faEdit } from '@fortawesome/free-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WishReservationComponent } from '../wish-reservation/wish-reservation.component';
import { ChangeWishReservationComponent } from '../wish-reservation/change-wish-reservation/change-wish-reservation.component';
import { GiftFeedbackComponent } from '../gift-feedback/gift-feedback.component';
import { CTAButtonConfig } from './wish-call-to-action-button/wish-call-to-action-button.component';
import { BannerConfig } from './wish-banner/wish-banner.component';
import { ActionListItemConfig } from './action-list/action-list-item/action-list-item.component';
import { WishDeleteComponent } from '../wish-delete/wish-delete.component';

@Component({
  template: '',
  styleUrls: ['./wish-item.component.css']
})
export class WishItemComponent implements OnInit {
  @Input() wish: Wish;
  wishActionItems : ActionListItemConfig[] = [];

  readonly CTAbuttonConfigs: { [key: string]: CTAButtonConfig } = {
    noButton: { text: null, icon: null },
    reserve: { text: "Reserveer", icon: faGift, onClick: this.reserve.bind(this) },
    cancel: { text: "Verwijder reservatie", icon: faBan, onClick: this.changeReservation.bind(this) },
    feedback: { text: "Geef feedback", icon: faComment, onClick: this.giveFeedback.bind(this) }
  };
  readonly bannerConfigs: { [key: string]: BannerConfig} = {
    noBanner: { text: null, backgroundColor: null, bannerIcon: null },
    yourIdea: { text: "Jouw idee", backgroundColor: 'warning', bannerIcon: faLightbulb },
    reserved: { text: "Gereserveerd", backgroundColor: 'danger', bannerIcon: faCartArrowDown },
    reservedByUser: { text: "Gereserveerd door jou", backgroundColor: 'warning', bannerIcon: faStar },
    received: { text: "Ontvangen", backgroundColor: 'danger', bannerIcon: faGift },
    givenByUser: { text: "Gegeven door jou", backgroundColor: 'warning', bannerIcon: faGift },
    fulfilled: { text: "Wens vervuld", backgroundColor: 'success', bannerIcon: faThumbsUp },
    fulfilledByUser: { text: "Wens vervuld door jou", backgroundColor: 'success', bannerIcon: faThumbsUp }
  };
  readonly actionListItemConfigs: { [key: string] : ActionListItemConfig } = {
    edit: { text: "Aanpassen", icon: faEdit, onClick: this.edit.bind(this) },
    copy: { text: "Zet op eigen lijst", icon: faClone, onClick: this.copy.bind(this) },
    delete: { text: "Verwijderen", icon: faTrashAlt, onClick: this.delete.bind(this) },
    externalSite: { text: "Externe website", icon: faGlobeEurope }
  };
  readonly wishScenarioConfig: { [key in WishScenario]: { CTAbutton: CTAButtonConfig, bannerConfig: BannerConfig} } = {
    'OPEN_WISH': { 
      CTAbutton: this.CTAbuttonConfigs.reserve,
      bannerConfig: this.bannerConfigs.noBanner 
    },
    'OPEN_WISH_CREATED_BY_USER_FOR_ANOTHER': {
      CTAbutton: this.CTAbuttonConfigs.reserve,
      bannerConfig: this.bannerConfigs.yourIdea 
    },
    'RESERVED': {
      CTAbutton: this.CTAbuttonConfigs.noButton,
      bannerConfig: this.bannerConfigs.reserved 
    },
    'RESERVED_BY_USER': {
      CTAbutton: this.CTAbuttonConfigs.cancel,
      bannerConfig: this.bannerConfigs.reservedByUser
    },
    'RESERVED_INCOGNITO_FOR_USER': {
      CTAbutton: this.CTAbuttonConfigs.reserve,
      bannerConfig: this.bannerConfigs.noBanner
    },
    'RECEIVED': {
      CTAbutton: this.CTAbuttonConfigs.noButton,
      bannerConfig: this.bannerConfigs.received
    },
    'RECEIVED_RECEIVER': {
      CTAbutton: this.CTAbuttonConfigs.feedback,
      bannerConfig: this.bannerConfigs.received
    },
    'RECEIVED_GIVEN_BY_USER': {
      CTAbutton: this.CTAbuttonConfigs.noButton,
      bannerConfig: this.bannerConfigs.givenByUser
    },
    'FULFILLED': {
      CTAbutton: this.CTAbuttonConfigs.noButton,
      bannerConfig: this.bannerConfigs.fulfilled
    },
    'FULFILLED_BY_USER': {
      CTAbutton: this.CTAbuttonConfigs.noButton,
      bannerConfig: this.bannerConfigs.fulfilledByUser
    }
  };

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    if (!this.wish.userIsReceiver) this.wishActionItems.push(this.actionListItemConfigs.copy);
    if (this.wish.userIsReceiver || this.wish.userIsCreator) {
      this.wishActionItems.unshift(this.actionListItemConfigs.edit);
      this.wishActionItems.push(this.actionListItemConfigs.delete);
    }
    if (this.wish.url) {
      this.actionListItemConfigs.externalSite.url = this.wish.url;
      this.wishActionItems.unshift(this.actionListItemConfigs.externalSite);
    }
  }

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
    let wishDeletePopup = this.modalService.open(WishDeleteComponent);
    wishDeletePopup.componentInstance.wish = this.wish;
  }

}
