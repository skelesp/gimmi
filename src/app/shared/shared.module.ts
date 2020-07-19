import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { BrandLogoComponent } from './brand-logo/brand-logo.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BrandLogoComponent],
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    BrandLogoComponent
  ]
})
export class SharedModule { }
