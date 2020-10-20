import { NgModule } from '@angular/core';

import { UsersRoutingModule } from './users-routing.module';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { SharedModule } from '../shared/shared.module';
import { UnknownUserMenuComponent } from './unknown-user-menu/unknown-user-menu.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthErrorInterceptor } from './interceptors/auth-error.interceptor';


@NgModule({
  declarations: [UserMenuComponent, UnknownUserMenuComponent],
  imports: [
    SharedModule,
    UsersRoutingModule
  ],
  exports: [
    UserMenuComponent,
    UnknownUserMenuComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ]
})
export class UsersModule { }
