import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { PasswordResetTokenResolver } from "./resolvers/password-reset-token-resolver.service";
import { EmailQueryParamGuard } from './guards/email-query-param.guard';


const routes: Routes = [
  { 
    path: 'users',
    children: [
      { path: 'login', component: LoginComponent, canActivate : [EmailQueryParamGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [EmailQueryParamGuard] },
      { path: 'forgotpassword', component: ForgotPasswordComponent },
      { path: 'resetpassword/:token', component: ResetPasswordComponent, resolve: { validToken: PasswordResetTokenResolver }}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
