import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ILocalLoginInfo, UserService } from '../../service/user.service';
import { faAt, faUnlockAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';

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
      
      // Notify user
      console.info(`User ${user.id} is authenticated.`);
      this.notificationService.showNotification(
        `Je bent nu ingelogd in Gimmi. Veel plezier gewenst!`,
        "success",
        `Welkom ${user.firstName}`
      );
        
      // Redirect user after authentication
      let redirectUrl = this.userService.attemptedUrl ? this.userService.attemptedUrl : "/";
      this.router.navigate([redirectUrl]);
      this.userService.attemptedUrl = null;
      
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
  }
}
