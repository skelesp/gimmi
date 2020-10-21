import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../users/guards/auth.guard';
import { InviteComponent } from './components/invite/invite.component';


const routes: Routes = [
  { 
    path:"people", children: [
      {
        path: "invite", 
        component: InviteComponent,
        canActivate: [AuthGuard]
      }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleRoutingModule { }
