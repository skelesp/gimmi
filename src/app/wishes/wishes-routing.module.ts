import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModalsClosedGuard } from '../shared/guards/modals-closed.guard';
import { AuthGuard } from '../users/guards/auth.guard';
import { WishPageComponent } from './components/wish-item/wish-page/wish-page.component';
import { WishResolver} from './resolvers/wish-resolver.service';

const routes: Routes = [
  {
    path: "wishes/:wishId", component: WishPageComponent, resolve: { wish: WishResolver }, canActivate: [AuthGuard, ModalsClosedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WishesRoutingModule { }
