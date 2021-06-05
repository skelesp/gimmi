import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { BrandLogoComponent } from './components/brand-logo/brand-logo.component';
import { RouterModule } from '@angular/router';
import { CursorPointerDirective } from './directives/cursor-pointer.directive';
import { CustomToastComponent } from './components/custom-toast/custom-toast.component';
import { BindQueryparamToInputDirective } from './directives/bind-queryparam-to-input.directive';
import { EmailInputComponent } from './components/form-components/email-input/email-input.component';
import { PasswordInputComponent } from './components/form-components/password-input/password-input.component';
import { PasswordCheckComponent } from './components/form-components/password-check/password-check.component';
import { ImagesModule } from '../images/images.module';

@NgModule({
  declarations: [
    BrandLogoComponent, 
    CursorPointerDirective, 
    CustomToastComponent, 
    BindQueryparamToInputDirective, 
    EmailInputComponent,
    PasswordInputComponent,
    PasswordCheckComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    ImagesModule
  ],
  exports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrandLogoComponent,
    CursorPointerDirective,
    CustomToastComponent,
    BindQueryparamToInputDirective,
    EmailInputComponent,
    PasswordInputComponent,
    PasswordCheckComponent,
    ImagesModule
  ]
})
export class SharedModule { }
