import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleSearchComponent } from './components/people-search/people-search.component';
import { InviteComponent } from './components/invite/invite.component';
import { UsersModule } from '../users/users.module';


@NgModule({
  declarations: [
    PeopleSearchComponent,
    InviteComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    PeopleRoutingModule,
    UsersModule
  ],
  exports: [
    PeopleSearchComponent,
    InviteComponent
  ]
})
export class PeopleModule { }
