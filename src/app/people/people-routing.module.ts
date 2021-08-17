import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../users/guards/auth.guard';
import { InviteComponent } from './components/invite/invite.component';
import { PersonDashboardComponent } from './components/person-dashboard/person-dashboard.component';
import { PersonResolver } from './resolvers/person-resolver.service';


const routes: Routes = [
  { 
    path:"people", children: [
      {
        path: "invite", component: InviteComponent, canActivate: [AuthGuard],
      }
    ] 
  },
  {
    path: "people/:personId", component: PersonDashboardComponent, resolve: { person: PersonResolver } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleRoutingModule { }
