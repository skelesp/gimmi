import { Component, OnInit } from '@angular/core';
import { SocialAuthService, FacebookLoginProvider } from "angularx-social-login";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { UserService } from '../../service/user.service';

@Component({
  selector: 'gimmi-facebook-login-button',
  templateUrl: './facebook-login-button.component.html',
  styleUrls: ['./facebook-login-button.component.css']
})
export class FacebookLoginButtonComponent implements OnInit {
  facebookIcon = faFacebookF;

  constructor( 
    private socialAuthServicve : SocialAuthService,
    private userService : UserService
  ) { }

  ngOnInit(): void {
  }

  loginWithFacebook () : void {
    this.socialAuthServicve.signIn(FacebookLoginProvider.PROVIDER_ID).then( (FBuser) => {
      this.userService.authenticateWithFacebook(FBuser).subscribe(
        (user) => {
          this.userService.redirectAfterAuthentication();
          this.userService.showAuthenticationConfirmation();
          console.info(`[FacebookLoginButtonComponent] User ${user.firstName} loggedIn with Facebook login button`);
        }
      );
    });
  }

}
