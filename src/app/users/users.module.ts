import { NgModule } from '@angular/core';

import { UsersRoutingModule } from './users-routing.module';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { SharedModule } from '../shared/shared.module';
import { UnknownUserMenuComponent } from './unknown-user-menu/unknown-user-menu.component';


@NgModule({
  declarations: [UserMenuComponent, UnknownUserMenuComponent],
  imports: [
    SharedModule,
    UsersRoutingModule
  ],
  exports: [
    UserMenuComponent,
    UnknownUserMenuComponent
  ]
})
export class UsersModule { }
