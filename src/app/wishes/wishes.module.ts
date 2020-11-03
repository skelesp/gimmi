import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WishesRoutingModule } from './wishes-routing.module';
import { WishListComponent } from './components/wish-list/wish-list.component';

@NgModule({
  declarations: [WishListComponent],
  imports: [
    CommonModule,
    WishesRoutingModule
  ],
  exports: [
    WishListComponent
  ]
})
export class WishesModule { }
