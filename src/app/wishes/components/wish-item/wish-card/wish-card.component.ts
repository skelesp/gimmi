import { Component } from '@angular/core';
import { WishItemComponent } from '../wish-item.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'gimmi-wish-card',
  templateUrl: './wish-card.component.html',
  styleUrls: ['./wish-card.component.css']
})
export class WishCardComponent extends WishItemComponent {

  constructor(
    private modalSrv: NgbModal
  ) {
    super(modalSrv);
  }

}
