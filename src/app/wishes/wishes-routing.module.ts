import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WishPageComponent } from './components/wish-item/wish-page/wish-page.component';
import { WishResolver} from './resolvers/wish-resolver.service';

const routes: Routes = [
  {
    path: "wishes/:wishId", component: WishPageComponent, resolve: {wish: WishResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WishesRoutingModule { }
