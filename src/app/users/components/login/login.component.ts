import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ILocalLoginInfo, UserService } from '../../service/user.service';
import { faAt, faUnlockAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'gimmi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  authenticationError: boolean = false;
  showPassword: boolean = false;
  mailIcon = faAt;
  passwordIcon = faUnlockAlt;
  showPasswordIcon = faEye;
  loggedInUser: User;
  currentUserSubscription: Subscription;
  redirectUrl: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required])
    });

    this.currentUserSubscription = this.userService.currentUser$.subscribe( user => {
      this.loggedInUser = user;
    });
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
      this.showPassword = true;
    });
  }

  toggleShowPassword () {
    this.showPassword = !this.showPassword;
    this.showPasswordIcon = this.showPassword ? faEyeSlash : faEye;
  }

  ngOnDestroy () {
    this.currentUserSubscription.unsubscribe();
    this.userService.attemptedUrl = null;
  }
}
