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
