import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WishesRoutingModule } from './wishes-routing.module';
import { WishListComponent } from './components/wish-list/wish-list.component';
import { SharedModule } from '../shared/shared.module';
import { FilterOnStatePipe } from './pipes/filter-on-state.pipe';

@NgModule({
  declarations: [WishListComponent, FilterOnStatePipe],
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
