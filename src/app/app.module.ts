import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { PeopleModule } from './people/people.module';

import { NavigationBarComponent } from './shared/navigation-bar/navigation-bar.component';
import { UserMenuComponent } from './shared/navigation-bar/user-menu/user-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    UserMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    PeopleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
