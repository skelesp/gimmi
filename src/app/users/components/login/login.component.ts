import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ILocalLoginInfo, UserService } from '../../service/user.service';
import { faAt, faUnlockAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'gimmi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  authenticationError: boolean;
  showPassword: boolean;
  mailIcon = faAt;
  passwordIcon = faUnlockAlt;
  showPasswordIcon = faEye;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required])
    });
    this.authenticationError = false;
  }

  login() {
    let credentials : ILocalLoginInfo = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }
    this.userService.authenticate( credentials ).subscribe( user => {
      console.info(`User ${user.id} is authenticated.`);
      this.authenticationError = false;
      this.loginForm.reset();

    }, error => {
      console.error(`Error occured: ${error}`);
      this.authenticationError = true;
      this.showPassword = true;
    });
  }

  toggleShowPassword () {
    this.showPassword = !this.showPassword;
    this.showPasswordIcon = this.showPassword ? faEyeSlash : faEye;
  }

}
