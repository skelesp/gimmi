import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../service/user.service';

@Component({
  selector: 'gimmi-unknown-user-menu',
  templateUrl: './unknown-user-menu.component.html',
  styleUrls: ['./unknown-user-menu.component.css']
})
export class UnknownUserMenuComponent implements OnInit {
  @Output() menuItemClicked = new EventEmitter<any>();
  
  registerIcon = faUserPlus;
  loginIcon = faSignInAlt;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  clearAttemptedEmail(): void {
    console.warn("Not implemented yet");
    this.menuItemClicked.emit();
  }

  register() {
    let registeredUser = {
      name: "Beeckmans",
      firstName: "Stijn",
      loginStrategy: "facebook",
      accounts: {
        facebook: { profile_pic: "https://avatars3.githubusercontent.com/u/17392369?s=400&v=4" }
      }
    }
    this.userService.register(registeredUser);
    this.menuItemClicked.emit();
  }

}
