import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { UsersRoutingModule } from './users-routing.module';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { SharedModule } from '../shared/shared.module';
import { UnknownUserMenuComponent } from './components/unknown-user-menu/unknown-user-menu.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthErrorInterceptor } from './interceptors/auth-error.interceptor';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LogoutButtonComponent } from './components/logout-button/logout-button.component';


@NgModule({
  declarations: [UserMenuComponent, UnknownUserMenuComponent, LoginComponent, RegisterComponent, LogoutButtonComponent],
  imports: [
    SharedModule,
    UsersRoutingModule
  ],
  exports: [
    UserMenuComponent,
    UnknownUserMenuComponent,
    LoginComponent,
    RegisterComponent,
    LogoutButtonComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true }
  ]
})
export class UsersModule { }
