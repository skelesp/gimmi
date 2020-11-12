import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Person } from 'src/app/people/models/person.model';
import { Wish, wishStatus } from '../../models/wish.model';
import { WishService } from '../../services/wish.service';

@Component({
  selector: 'gimmi-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit, OnChanges {
  @Input() receiver : Person;
  wishes: Wish[];
  loading: boolean = false;
  wishlistFilter: wishStatus[] = ["Open", "Received", "Reserved"];
  
  constructor( 
    private wishService : WishService
  ) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.loading = true;
    this.wishes = [];
    this.wishService.getWishlist(this.receiver).subscribe( (wishes) => {
      this.wishes = wishes
      this.loading = false;
    }, () => {
      this.wishes = null;
      this.loading = false;
    }
    );
  }

  ngOnInit(): void {
  }
}
