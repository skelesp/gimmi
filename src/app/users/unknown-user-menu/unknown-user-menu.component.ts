import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ILocalLoginInfo, UserService } from '../service/user.service';

@Component({
  selector: 'gimmi-unknown-user-menu',
  templateUrl: './unknown-user-menu.component.html',
  styleUrls: ['./unknown-user-menu.component.css']
})
export class UnknownUserMenuComponent implements OnInit {
  @Output() menuItemClicked = new EventEmitter<any>();
  
  registerIcon = faUserPlus;
  loginIcon = faSignInAlt;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  register() {
    let registeredUser = {
      id: '85070820135',
      name: "Beeckmans",
      firstName: "Stijn",
      loginStrategy: "local"
    }
    this.userService.register(registeredUser);
    this.menuItemClicked.emit();
  }

  login() {
    let credentials: ILocalLoginInfo = {
      email: "stijn.beeckmans@gmail.com",
      password: "test"
    };
    this.userService.authenticate(credentials).subscribe(
      user => console.log(user),
      error => this.notificationService.showNotification("Login is gefaald, probeer opnieuw of registreer je.", "error"));
  }

}
