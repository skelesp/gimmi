import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { User, UserService } from 'src/app/users/service/user.service';

@Component({
  selector: 'gimmi-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {
  public isNavbarCollapsed = true;

  currentUser: User;
  currentUserSubscription: Subscription;

  constructor( private userService: UserService) {}

  toggleNavbarCollapseState () {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
    })
  }
  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }
}
