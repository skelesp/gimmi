import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'gimmi-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm : FormGroup;
  successAlertClosed : boolean;
  requestSent : boolean = false;
  
  constructor() { }

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup ({});
  }

  public requestPasswordReset () : void {
    window.alert(`Send API request for email ${this.forgotPasswordForm.value.email}`);
    this.requestSent = true;
  }

}
