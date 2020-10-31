import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'gimmi-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({ });
  }

  public saveNewPassword () {
    window.alert('New password saved');
  }

}
