import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'gimmi-facebook-share-button',
  templateUrl: './facebook-share-button.component.html',
  styleUrls: ['./facebook-share-button.component.css']
})
export class FacebookShareButtonComponent {
  @Input() url : string;
  facebookIcon : IconDefinition = faFacebook;
  constructor() { }

  shareOnFacebook () {
    FB.ui({
      method: 'share',
      href: this.url
    }, function (response) {
      console.log(response);
      console.log(this.url);
    });
  }

}
