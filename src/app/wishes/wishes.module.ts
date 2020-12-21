import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WishesRoutingModule } from './wishes-routing.module';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { SharedModule } from '../shared/shared.module';
import { FilterOnStatePipe } from './pipes/filter-on-state.pipe';
import { WishItemComponent } from './components/wish-item/wish-item.component';
import { WishCardComponent } from './components/wish-item/wish-card/wish-card.component';
import { WishBannerComponent } from './components/wish-item/wish-banner/wish-banner.component';

@NgModule({
  declarations: [WishListComponent, FilterOnStatePipe, WishItemComponent, WishCardComponent, WishBannerComponent],
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
