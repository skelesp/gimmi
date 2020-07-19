import { NgModule } from '@angular/core';

import { UsersRoutingModule } from './users-routing.module';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [UserMenuComponent],
  imports: [
    SharedModule,
    UsersRoutingModule
  ],
  exports: [
    UserMenuComponent
  ]
})
export class UsersModule { }
