import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WishesRoutingModule } from './wishes-routing.module';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { SharedModule } from '../shared/shared.module';
import { FilterOnStatePipe } from './pipes/filter-on-state.pipe';
import { WishItemComponent } from './components/wish-item/wish-item.component';
import { WishCardComponent } from './components/wish-item/wish-card/wish-card.component';

@NgModule({
  declarations: [WishListComponent, FilterOnStatePipe, WishItemComponent, WishCardComponent],
  imports: [
    CommonModule,
    SharedModule,
    WishesRoutingModule
  ],
  exports: [
    WishListComponent
  ]
})
export class WishesModule { }
