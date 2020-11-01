import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faWindows } from '@fortawesome/free-brands-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'gimmi-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  invalidToken : boolean;

  constructor(
    private userService: UserService,
    private notificationService : NotificationService,
    private router : Router,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({ });
    this.userService.validatePasswordResetToken(this.route.snapshot.paramMap.get('token')).subscribe( token => {
      this.invalidToken = token ? false : true ;
      console.log(token);
    }, () => { this.invalidToken = true; });
  }

  public saveNewPassword () {
    this.userService.resetPassword(
      this.resetPasswordForm.get('passwordGroup.password').value, 
      this.route.snapshot.paramMap.get('token'))
    .subscribe( response => {
        this.notificationService.showNotification(
          'Wachtwoord reset is succesvol uitgevoerd. Je kan nu opnieuw inloggen.',
          'success',
          'Wachtwoord aangepast'
        );
        this.router.navigate(['/users/login'], {
          queryParams: { e: response.email}
        });
      },
      error => {
        this.notificationService.showNotification(
        'Wachtwoord reset is gefaald. Vermoedelijk is de link vervallen. Vraag een nieuwe link aan.',
        'error',
        'Link vervallen'
        );
        this.invalidToken = true;
    });
  }

}
