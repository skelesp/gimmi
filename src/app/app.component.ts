import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from "angularx-social-login";

@Component({
  selector: 'gimmi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor ( 
    private socialAuthService : SocialAuthService
  ) {}
  
  ngOnInit(): void {
    this.socialAuthService.authState.subscribe( (FBuser) => {
      console.log(FBuser)
    });
  }
}
