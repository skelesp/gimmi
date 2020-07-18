import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';



@NgModule({
  declarations: [NavigationBarComponent],
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule
  ],
  exports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    NavigationBarComponent
  ]
})
export class SharedModule { }
