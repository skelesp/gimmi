import { Component, Input, OnInit } from '@angular/core';
import { Wish } from '../../models/wish.model';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { PeopleService } from 'src/app/people/service/people.service';

@Component({
  template: '',
  styleUrls: ['./wish-item.component.css']
})
export class WishItemComponent implements OnInit {
  @Input() wish: Wish;
  faEllipsisV = faEllipsisV;
  userIsReceiver: boolean;
  userIsCreator: boolean;
  userIsReservator: boolean;

  constructor( 
    private peopleService : PeopleService
   ) { }

  ngOnInit(): void {
    this.userIsCreator = this.peopleService.isEqualToCurrentUser( this.wish.createdBy );
    this.userIsReceiver = this.peopleService.isEqualToCurrentUser(this.wish.receiver );
    this.userIsReservator = this.peopleService.isEqualToCurrentUser(this.wish.reservation?.reservedBy);
  }
  
  edit () {
    window.alert(`editwish: ${this.wish.title}`);
  }

  copy() {
    window.alert(`Copy wish: ${this.wish.title}`);
  }

  reserve() {
    window.alert(`Reserve wish: ${this.wish.title}`);
  }

  delete() {
    window.alert(`Delete wish: ${this.wish.title}`);
  }

}
