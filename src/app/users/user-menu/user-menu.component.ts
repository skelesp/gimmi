import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ILocalLoginInfo, IUser, UserService } from 'src/app/users/service/user.service';
import { Subscription } from 'rxjs';
import { faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'gimmi-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit, OnDestroy {
  @Input() currentUser: IUser;
  currentUserSubscription: Subscription;

  userIcon = faUserCircle;
  facebookIcon = faFacebookF;
  logoutIcon = faSignOutAlt;

  constructor( 
    private userService: UserService,
    private notificationService: NotificationService
    ) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.userService.currentUser$.subscribe( user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.userService.logout();
    this.notificationService.showNotification(
      "Je gebruiker is nu uitgelogd.",
      "info",
      'Uitgelogd'
    );
  }

  logOutFacebook(): void {
    this.userService.logout();
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

}
