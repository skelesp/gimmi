import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleSearchComponent } from './people-search/people-search.component';


@NgModule({
  declarations: [
    PeopleSearchComponent
  ],
  imports: [
    SharedModule,
    PeopleRoutingModule
  ],
  exports: [
    PeopleSearchComponent
  ]
})
export class PeopleModule { }
