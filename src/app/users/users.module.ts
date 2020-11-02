import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SocialLoginModule, SocialAuthServiceConfig } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";

import { UsersRoutingModule } from './users-routing.module';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { SharedModule } from '../shared/shared.module';
import { UnknownUserMenuComponent } from './components/unknown-user-menu/unknown-user-menu.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthErrorInterceptor } from './interceptors/auth-error.interceptor';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LogoutButtonComponent } from './components/logout-button/logout-button.component';
import { ForgotPasswordLinkComponent } from './components/forgot-password-link/forgot-password-link.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FacebookLoginButtonComponent } from './components/facebook-login-button/facebook-login-button.component';


@NgModule({
  declarations: [UserMenuComponent, UnknownUserMenuComponent, LoginComponent, RegisterComponent, LogoutButtonComponent, ForgotPasswordLinkComponent, ForgotPasswordComponent, ResetPasswordComponent, FacebookLoginButtonComponent],
  imports: [
    SharedModule,
    UsersRoutingModule,
    SocialLoginModule
  ],
  exports: [
    UserMenuComponent,
    UnknownUserMenuComponent,
    LoginComponent,
    RegisterComponent,
    LogoutButtonComponent,
    ForgotPasswordLinkComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true },
    { provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          { 
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('106212316803375')
          }
        ]
      } as SocialAuthServiceConfig  
    }
  ]
})
export class UsersModule { }
