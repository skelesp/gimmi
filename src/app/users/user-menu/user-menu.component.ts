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
    })
  }

  clearAttemptedEmail(): void {
    console.warn("Not implemented yet");
  }

  register() {
    let registeredUser = {
      name: "Beeckmans",
      firstName: "Stijn",
      loginStrategy: "facebook",
      accounts: {
        facebook: { profile_pic: "https://avatars3.githubusercontent.com/u/17392369?s=400&v=4"}
      }
    }
    this.userService.register(registeredUser);
  }

  logout(): void {
    console.warn("Not implemented yet");
  }

  logOutFacebook(): void {
    console.warn("Not implemented yet");
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

}
