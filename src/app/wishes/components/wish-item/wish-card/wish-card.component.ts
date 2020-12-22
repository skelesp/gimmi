import { Component } from '@angular/core';
import { WishItemComponent } from '../wish-item.component';

@Component({
  selector: 'gimmi-wish-card',
  templateUrl: './wish-card.component.html',
  styleUrls: ['./wish-card.component.css']
})
export class WishCardComponent extends WishItemComponent {

  constructor() {
    super();
   }

}
