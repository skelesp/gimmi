import { Component, Input, OnInit } from '@angular/core';
import { Wish } from '../../models/wish.model';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

@Component({
  template: '',
  styleUrls: ['./wish-item.component.css']
})
export class WishItemComponent implements OnInit {
  @Input() wish: Wish;
  faEllipsisV = faEllipsisV;

  constructor( ) { }

  ngOnInit(): void {}

  blurWishCardStatus() : boolean {
    return !(this.wish.scenario === 'RESERVED_INCOGNITO_FOR_USER' || this.wish.scenario === 'OPEN_WISH_CREATED_BY_USER_FOR_ANOTHER' || this.wish.scenario === 'OPEN_WISH');
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
