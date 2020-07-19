import { Component } from '@angular/core';

@Component({
  selector: 'gimmi-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  public isMenuCollapsed = true;
}
