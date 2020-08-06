import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { BrandLogoComponent } from './components/brand-logo/brand-logo.component';
import { RouterModule } from '@angular/router';
import { CursorPointerDirective } from './directives/cursor-pointer.directive';
import { CustomToastComponent } from './components/custom-toast/custom-toast.component';

@NgModule({
  declarations: [BrandLogoComponent, CursorPointerDirective, CustomToastComponent],
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    BrandLogoComponent,
    CursorPointerDirective,
    CustomToastComponent
  ]
})
export class SharedModule { }
