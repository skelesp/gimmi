import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WishPageComponent } from './components/wish-item/wish-page/wish-page.component';

const routes: Routes = [
  {
    path: "wishes/:wishId", component: WishPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WishesRoutingModule { }
