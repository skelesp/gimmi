import { Component, OnDestroy, OnInit } from '@angular/core';
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faListAlt, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { UserService } from 'src/app/users/service/user.service';
import { User } from 'src/app/users/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'gimmi-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.css']
})
export class HowToUseComponent implements OnInit, OnDestroy {
  registerIcon = faUserPlus;
  listIcon = faListAlt;
  sendIcon = faPaperPlane;
  currentUser : User;
  currentUserSubscription : Subscription;
  
  constructor( private userService : UserService) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.userService.currentUser$.subscribe( user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

}
