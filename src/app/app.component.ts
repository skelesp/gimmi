import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from "angularx-social-login";
import { UserService } from './users/service/user.service';

@Component({
  selector: 'gimmi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor ( 
    private socialAuthService : SocialAuthService,
    private userService : UserService
  ) {}
  
  ngOnInit(): void {
    this.socialAuthService.authState.subscribe( (FBuser) => {
      if (FBuser) {
        this.userService.authenticateWithFacebook(FBuser).subscribe(
          (user) => {
            console.info(`[AppComponent] User ${user.firstName} loggedIn with Facebook autologin`);
          }
        );
      } else {
        console.info('[AppComponent] No user found via Facebook autologin')
      }
    });
  }
}
