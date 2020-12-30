import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { WishScenario } from 'src/app/wishes/models/wish.model';

interface CTAButtonConfig {
  text: string;
  icon: IconDefinition
}

const reserveButtonConfig: CTAButtonConfig = { text: "Reserveer", icon: null };
const noButtonConfig: CTAButtonConfig = { text: null, icon: null };
const cancelButtonConfig: CTAButtonConfig = { text: "Annuleer", icon: null };
const feedbackButtonConfig: CTAButtonConfig = { text: "Geef feedback", icon: null };

const buttonConfigs: { [key in WishScenario]: CTAButtonConfig } = {
  'OPEN_WISH': reserveButtonConfig,
  'OPEN_WISH_CREATED_BY_USER_FOR_ANOTHER': reserveButtonConfig,
  'RESERVED': noButtonConfig,
  'RESERVED_BY_USER': cancelButtonConfig,
  'RESERVED_INCOGNITO_FOR_USER': reserveButtonConfig,
  'RECEIVED': noButtonConfig,
  'RECEIVED_RECEIVER': feedbackButtonConfig,
  'RECEIVED_GIVEN_BY_USER': noButtonConfig,
  'FULFILLED': noButtonConfig,
  'FULFILLED_BY_USER': noButtonConfig
};

@Component({
  selector: 'gimmi-wish-call-to-action-button',
  templateUrl: './wish-call-to-action-button.component.html',
  styleUrls: ['./wish-call-to-action-button.component.css']
})
export class WishCallToActionButtonComponent implements OnInit, OnChanges {
  @Input() scenario : WishScenario;
  config: CTAButtonConfig = { text: null, icon: null };
  
  constructor() { }

  ngOnInit(): void {
    this.config = buttonConfigs[this.scenario];
  }

  ngOnChanges(): void {
    this.config = buttonConfigs[this.scenario];    
  }

}
