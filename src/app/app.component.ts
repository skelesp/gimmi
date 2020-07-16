import { Component } from '@angular/core';
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: 'gimmi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gimmi';
  faTwitter = faTwitter;
}
