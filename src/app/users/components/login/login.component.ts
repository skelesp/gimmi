import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ILocalLoginInfo, UserService } from '../../service/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'gimmi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  authenticationError: boolean = false;
  loggedInUser: User;
  currentUserSubscription: Subscription;
  redirectUrl: string;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({});

    this.currentUserSubscription = this.userService.currentUser$.subscribe( user => {
      this.loggedInUser = user;
    });
    // RedirectUrl only used to show in component 
    this.redirectUrl = this.userService.attemptedUrl ? environment.rootSiteUrl + this.userService.attemptedUrl : null;
  }

  login() {
    let credentials : ILocalLoginInfo = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }
    this.userService.authenticate( credentials ).subscribe( user => {
      // Form handling
      this.authenticationError = false;
      this.loginForm.reset();
      
      this.userService.showAuthenticationConfirmation();
      this.userService.redirectAfterAuthentication();

    }, error => {
      console.error(error);
      this.authenticationError = true;
    });
  }

  ngOnDestroy () {
    this.currentUserSubscription.unsubscribe();
    this.userService.attemptedUrl = null;
  }
}
