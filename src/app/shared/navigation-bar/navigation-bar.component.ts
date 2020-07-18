import { Component, OnInit } from '@angular/core';
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: 'gimmi-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  userIcon = faUserCircle;
  facebookIcon = faFacebookF;
  currentUser;
  constructor() { }

  ngOnInit(): void {
  }

  logout(): void {
    console.warn("Not implemented yet");
  }

  logOutFacebook () : void {
    console.warn("Not implemented yet");
  }

  clearAttemptedEmail() : void {
    console.warn("Not implemented yet");
  }

}
