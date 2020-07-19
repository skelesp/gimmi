import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule
  ]
})
export class SharedModule { }
