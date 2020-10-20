import { Component, OnInit } from '@angular/core';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { IUser, UserService } from '../../users/service/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'gimmi-landing-page-banner',
  templateUrl: './landing-page-banner.component.html',
  styleUrls: ['./landing-page-banner.component.css']
})
export class LandingPageBannerComponent implements OnInit {
  checkIcon = faCheckCircle;
  currentUser: IUser;
  currentUserSubscription: Subscription;

  constructor( private userService: UserService) { }

  ngOnInit(): void {
    this.currentUserSubscription = this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

}
