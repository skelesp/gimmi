import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { faStar, faLightbulb, faCartArrowDown, faGift, faThumbsUp, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { wishStatus } from 'src/app/wishes/models/wish.model';

type BannerColors = 'danger' | 'warning' | 'success';
type WishScenarios = 'OPEN_WISH' | 'OPEN_WISH_CREATED_BY_USER_FOR_ANOTHER' | 'RESERVED' | 'RESERVED_BY_USER' | 'RESERVED_INCOGNITO_FOR_USER' | 'RECEIVED' | 'RECEIVED_GIVEN_BY_USER' | 'FULFILLED' | 'FULFILLED_BY_USER';
interface BannerConfig { 
  text: string, 
  backgroundColor: BannerColors, 
  bannerIcon: IconDefinition 
}

const bannerConfigs: {[key  in WishScenarios]: BannerConfig} = {
  'OPEN_WISH': { text: null, backgroundColor: null, bannerIcon: null},
  'OPEN_WISH_CREATED_BY_USER_FOR_ANOTHER': { text: "Jouw idee", backgroundColor: 'warning', bannerIcon: faLightbulb },
  'RESERVED': { text: "Gereserveerd", backgroundColor: 'danger', bannerIcon: faCartArrowDown },
  'RESERVED_BY_USER': { text: "Jouw reservatie", backgroundColor: 'warning', bannerIcon: faStar},
  'RESERVED_INCOGNITO_FOR_USER': { text: null, backgroundColor: null, bannerIcon: null },
  'RECEIVED': { text: "Ontvangen", backgroundColor: 'danger', bannerIcon: faGift },
  'RECEIVED_GIVEN_BY_USER': { text: "Jouw cadeau", backgroundColor: 'warning', bannerIcon: faGift },
  'FULFILLED': { text: "Wens vervuld", backgroundColor: 'success', bannerIcon: faThumbsUp },
  'FULFILLED_BY_USER': { text: "Jouw cadeau", backgroundColor: 'success', bannerIcon: faThumbsUp }
};
@Component({
  selector: 'gimmi-wish-banner',
  templateUrl: './wish-banner.component.html',
  styleUrls: ['./wish-banner.component.css']
})
export class WishBannerComponent implements OnInit, OnChanges {
  @Input() status : wishStatus;
  @Input() userIsReceiver : boolean;
  @Input() userIsCreator : boolean;
  @Input() userIsReservator : boolean;

  config : BannerConfig = {text: null, backgroundColor: null, bannerIcon: null};

  ngOnInit(): void {
    this.configureBanner();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.configureBanner();
  }

  configureBanner() {
    switch (this.status) {
      case 'Open':
        if (!this.userIsReceiver && this.userIsCreator) {
          this.config = bannerConfigs.OPEN_WISH_CREATED_BY_USER_FOR_ANOTHER
        }
        break;
      case 'Reserved':
        if (this.userIsReservator ){
          this.config = bannerConfigs.RESERVED_BY_USER
        } else if (!this.userIsReceiver) {
          this.config = bannerConfigs.RESERVED        
        }
        break;
      case 'Received':
        if (this.userIsReservator) {
          this.config = bannerConfigs.RECEIVED_GIVEN_BY_USER
        } else {
          this.config = bannerConfigs.RECEIVED
        }
        break;
      case 'Fulfilled':
        if (this.userIsReservator) {
          this.config = bannerConfigs.FULFILLED_BY_USER
        } else {
          this.config = bannerConfigs.FULFILLED
        }
        break;       
      default:
        this.config = bannerConfigs.OPEN_WISH
        break;
    }
  }
}
