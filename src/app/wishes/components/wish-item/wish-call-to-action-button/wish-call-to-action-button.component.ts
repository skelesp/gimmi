import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faBan, faGift } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { WishScenario } from 'src/app/wishes/models/wish.model';
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
  @Input() scenario : WishScenario;
  config: CTAButtonConfig = { text: null, icon: null };
  
  readonly noButtonConfig: CTAButtonConfig = { text: null, icon: null };
  readonly reserveButtonConfig: CTAButtonConfig = { text: "Reserveer", icon: faGift, onClick: this.reserve.bind(this) };
  readonly cancelButtonConfig: CTAButtonConfig = { text: "Wijzig reservatie", icon: faBan, onClick: this.changeReservation.bind(this) };
  readonly feedbackButtonConfig: CTAButtonConfig = { text: "Geef feedback", icon: faComment, onClick: this.giveFeedback.bind(this) };

  readonly buttonConfigs: { [key in WishScenario]: CTAButtonConfig } = {
    'OPEN_WISH': this.reserveButtonConfig,
    'OPEN_WISH_CREATED_BY_USER_FOR_ANOTHER': this.reserveButtonConfig,
    'RESERVED': this.noButtonConfig,
    'RESERVED_BY_USER': this.cancelButtonConfig,
    'RESERVED_INCOGNITO_FOR_USER': this.reserveButtonConfig,
    'RECEIVED': this.noButtonConfig,
    'RECEIVED_RECEIVER': this.feedbackButtonConfig,
    'RECEIVED_GIVEN_BY_USER': this.noButtonConfig,
    'FULFILLED': this.noButtonConfig,
    'FULFILLED_BY_USER': this.noButtonConfig
  };

  constructor( private modalService: NgbModal) {  }

  ngOnInit(): void {
    this.config = this.buttonConfigs[this.scenario];
  }

  ngOnChanges(): void {
    this.config = this.buttonConfigs[this.scenario];    
  }

  reserve () {
    this.modalService.open(WishReservationComponent);
  }
  changeReservation() {
    alert("Wijzig reservatie");
  }
  giveFeedback(){
    alert("Geef feedback");
  }

}
