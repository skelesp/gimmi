import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleSearchComponent } from './components/people-search/people-search.component';
import { InviteComponent } from './components/invite/invite.component';


@NgModule({
  declarations: [
    PeopleSearchComponent,
    InviteComponent
  ],
  imports: [
    SharedModule,
    PeopleRoutingModule
  ],
  exports: [
    PeopleSearchComponent,
    InviteComponent
  ]
})
export class PeopleModule { }
