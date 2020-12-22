import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { faStar, faLightbulb, faCartArrowDown, faGift, faThumbsUp, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { WishScenario, wishStatus } from 'src/app/wishes/models/wish.model';

type BannerColors = 'danger' | 'warning' | 'success';
interface BannerConfig { 
  text: string, 
  backgroundColor: BannerColors, 
  bannerIcon: IconDefinition 
}

const bannerConfigs: {[key  in WishScenario]: BannerConfig} = {
  'OPEN_WISH': { text: null, backgroundColor: null, bannerIcon: null},
  'OPEN_WISH_CREATED_BY_USER_FOR_ANOTHER': { text: "Jouw idee", backgroundColor: 'warning', bannerIcon: faLightbulb },
  'RESERVED': { text: "Gereserveerd", backgroundColor: 'danger', bannerIcon: faCartArrowDown },
  'RESERVED_BY_USER': { text: "Gereserveerd door jou", backgroundColor: 'warning', bannerIcon: faStar},
  'RESERVED_INCOGNITO_FOR_USER': { text: null, backgroundColor: null, bannerIcon: null },
  'RECEIVED': { text: "Ontvangen", backgroundColor: 'danger', bannerIcon: faGift },
  'RECEIVED_GIVEN_BY_USER': { text: "Gegeven door jou", backgroundColor: 'warning', bannerIcon: faGift },
  'FULFILLED': { text: "Wens vervuld", backgroundColor: 'success', bannerIcon: faThumbsUp },
  'FULFILLED_BY_USER': { text: "Wens vervuld door jou", backgroundColor: 'success', bannerIcon: faThumbsUp }
};
@Component({
  selector: 'gimmi-wish-banner',
  templateUrl: './wish-banner.component.html',
  styleUrls: ['./wish-banner.component.css']
})
export class WishBannerComponent implements OnInit, OnChanges {
  @Input() scenario : WishScenario

  config : BannerConfig = {text: null, backgroundColor: null, bannerIcon: null};

  ngOnInit(): void {
    this.config = bannerConfigs[this.scenario];
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.config = bannerConfigs[this.scenario];
  }

}
