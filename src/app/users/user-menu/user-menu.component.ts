import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, UserService } from 'src/app/users/service/user.service';
import { Subscription } from 'rxjs';
import { faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: 'gimmi-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;

  userIcon = faUserCircle;
  facebookIcon = faFacebookF;
  logoutIcon = faSignOutAlt;

  constructor( private userService: UserService) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.userService.currentUser.subscribe( user => {
      this.currentUser = user;
      console.info("user changed", user);
    })
  }

  logout(): void {
    this.userService.logout();
  }

  logOutFacebook(): void {
    this.userService.logout();
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

}
