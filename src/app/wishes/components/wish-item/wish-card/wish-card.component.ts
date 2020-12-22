import { Component, OnInit } from '@angular/core';
import { PeopleService } from 'src/app/people/service/people.service';
import { WishItemComponent } from '../wish-item.component';

@Component({
  selector: 'gimmi-wish-card',
  templateUrl: './wish-card.component.html',
  styleUrls: ['./wish-card.component.css']
})
export class WishCardComponent extends WishItemComponent {

  constructor(peopleService: PeopleService) {
    super(peopleService);
   }

}
