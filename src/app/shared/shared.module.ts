import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { UserMenuComponent } from './navigation-bar/user-menu/user-menu.component';

@NgModule({
  declarations: [
    NavigationBarComponent, 
    UserMenuComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule
  ],
  exports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
    NavigationBarComponent,
    UserMenuComponent
  ]
})
export class SharedModule { }
