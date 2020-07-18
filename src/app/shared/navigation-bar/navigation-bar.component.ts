import { Component, OnInit, OnDestroy } from '@angular/core';
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { User, UserService } from 'src/app/users/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'gimmi-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  userIcon = faUserCircle;
  facebookIcon = faFacebookF;
  currentUser: User;
  currentUserSubscription: Subscription;

  constructor( private userService: UserService ) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.userService.currentUser.subscribe( user => {
      this.currentUser = user;
    })
  }

  logout(): void {
    console.warn("Not implemented yet");
  }

  logOutFacebook () : void {
    console.warn("Not implemented yet");
  }

  clearAttemptedEmail() : void {
    console.warn("Not implemented yet");
  }

  register() {
    let registeredUser = {
      name: "Beeckmans",
      firstName: "Stijn",
      loginStrategy: "local"
    }
    this.userService.register(registeredUser);
  }

  ngOnDestroy () {
    this.currentUserSubscription.unsubscribe();
  }
}
