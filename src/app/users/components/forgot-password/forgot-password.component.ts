import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'gimmi-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm : FormGroup;
  successAlertClosed : boolean;
  requestSent : boolean = false;
  
  constructor( 
    private userService : UserService,
    private notificationService : NotificationService
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup ({});
  }

  public requestPasswordReset () : void {
    this.userService.requestPasswordReset(this.forgotPasswordForm.value.email).subscribe(() => {
      this.requestSent = true;
      this.notificationService.showNotification(
        'Er is een email verzonden naar uw emailadres. Gelieve op de link in de mail te klikken.',
        'success'
      )
    });
  }

}
