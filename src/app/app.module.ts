import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { ToastNotificationsModule } from "ngx-toast-notifications";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { PeopleModule } from './people/people.module';
import { WishesModule } from './wishes/wishes.module';

import { NavigationBarComponent } from './shared/components/navigation-bar/navigation-bar.component';
import { CustomToastComponent } from './shared/components/custom-toast/custom-toast.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    PeopleModule,
    UsersModule,
    WishesModule,
    BrowserAnimationsModule,
    ToastNotificationsModule.forRoot({
      position: "top-right",
      component: CustomToastComponent,
      autoClose: true,
      duration: 4000
    }),
    AppRoutingModule,
  ],
  providers: [ Title ],
  bootstrap: [AppComponent]
})
export class AppModule { }
