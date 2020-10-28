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
  @Input() controlName : string = 'password'
  @Input() placeholder : string = 'Wachtwoord'
  
  showPassword: boolean = false;
  passwordIcon = faUnlockAlt;
  showPasswordIcon = faEye;

  constructor() { }

  ngOnInit(): void {
    this.parentFormGroup.addControl(this.controlName, new FormControl(null, Validators.required));
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
    this.showPasswordIcon = this.showPassword ? faEyeSlash : faEye;
  }
}
