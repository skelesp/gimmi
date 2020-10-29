import { Component, Input } from '@angular/core';

@Component({
  selector: 'gimmi-forgot-password-link',
  template: `<a [routerLink]="['/users/forgotpassword']" 
                [queryParams]="{e:attemptedEmail}">
                {{linkText}}</a>`,
  styleUrls: ['./forgot-password-link.component.css']
})
export class ForgotPasswordLinkComponent {
  @Input() attemptedEmail : string;
  @Input() linkText : string;

}
