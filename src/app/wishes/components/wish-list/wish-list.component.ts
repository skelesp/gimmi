import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Person } from 'src/app/people/models/person.model';
import { Wish } from '../../models/wish.model';
import { WishService } from '../../services/wish.service';

@Component({
  selector: 'gimmi-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit, OnChanges {
  @Input() receiver : Person;
  wishes: Wish[];
  
  constructor( 
    private wishService : WishService
  ) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    console.warn('[WishListComponent] CALLED ngOnChanges!', changes);
    this.wishService.getWishlist(this.receiver).subscribe( (wishes) => {
      this.wishes = wishes.filter( (wish) => {
        return wish.status === 'open';
      });
    });
  }

  ngOnInit(): void {
  }
}
