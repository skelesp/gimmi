import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { faStar, faLightbulb, faCartArrowDown, faGift, faThumbsUp, IconDefinition, faSadCry } from "@fortawesome/free-solid-svg-icons";
import { wishStatus } from 'src/app/wishes/models/wish.model';

type BannerColors = 'danger' | 'warning' | 'success';

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

  text: string ;
  backgroundColor : BannerColors;
  bannerIcon: IconDefinition;

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
          this.text = "Jouw idee";
          this.backgroundColor = 'warning';
          this.bannerIcon = faLightbulb;
        }
        break;
      case 'Reserved':
        if (this.userIsReservator ){
          this.text = "Jouw reservatie";
          this.backgroundColor = 'warning';
          this.bannerIcon = faStar;
        } else if (!this.userIsReceiver) {
            this.text = "Gereserveerd";
            this.backgroundColor = 'danger';
            this.bannerIcon = faCartArrowDown;
        }
        break;
      case 'Received':
        if (this.userIsReservator) {
          this.text = "Jouw cadeau";
          this.backgroundColor = 'warning';
          this.bannerIcon = faGift;
        } else {
          this.text = "Ontvangen";
          this.backgroundColor = 'danger';
          this.bannerIcon = faGift;
        }
        break;
      case 'Fulfilled':
        if (this.userIsReservator) {
          this.text = "Wens vervuld";
          this.backgroundColor = 'success';
          this.bannerIcon = faThumbsUp;
        }
        break;       
      default:
        break;
    }
  }
}
