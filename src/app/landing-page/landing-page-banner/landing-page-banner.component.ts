import { Component, OnInit } from '@angular/core';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'gimmi-landing-page-banner',
  templateUrl: './landing-page-banner.component.html',
  styleUrls: ['./landing-page-banner.component.css']
})
export class LandingPageBannerComponent implements OnInit {
  checkIcon = faCheckCircle;
  currentUser;

  constructor() { }

  ngOnInit(): void {
    
  }

}
