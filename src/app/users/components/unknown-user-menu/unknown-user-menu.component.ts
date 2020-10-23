import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../models/user.model';
import { UserService } from '../../service/user.service';

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
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  register() {
    let registeredUser = new User (
      '85070820135',
      "Beeckmans",
       "Stijn",
       "stijn.beeckmans@gmail.com",
       "local",
       "test-token-for-new-user",
       []
    )
    this.userService.register(registeredUser);
    this.menuItemClicked.emit();
  }

}
