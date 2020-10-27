import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faUnlockAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'gimmi-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.css']
})
export class PasswordInputComponent implements OnInit {
  @Input() parentFormGroup : FormGroup;
  passwordIcon = faUnlockAlt;
  showPasswordIcon = faEye;
  showPassword: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.parentFormGroup.addControl('password', new FormControl(null, Validators.required));
    this.parentFormGroup.addControl('passwordCheck', new FormControl(null, [Validators.required, this.samePassword.bind(this)]));
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
    this.showPasswordIcon = this.showPassword ? faEyeSlash : faEye;
  }

  samePassword( control : FormControl) : {'passwordMatch': boolean} {
    if (control.value === this.parentFormGroup.controls.password.value) return null;
    return { 'passwordMatch': true}
  }

}
