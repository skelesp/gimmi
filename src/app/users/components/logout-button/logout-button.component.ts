import { Component, Input } from '@angular/core';
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { UserService } from '../../service/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'gimmi-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.css']
})
export class LogoutButtonComponent {
  @Input() currentUser : User;
  facebookIcon = faFacebookF;
  logoutIcon = faSignOutAlt;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) { }

  logout(): void {
    this.userService.logout("USER_EVENT");
    this.notificationService.showNotification(
      "Je gebruiker is nu uitgelogd.",
      "info",
      'Uitgelogd'
    );
    location.reload();
  }

  logOutFacebook(): void {
    this.userService.logout("USER_EVENT");
  }

}
