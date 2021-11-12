import { Component, Input} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'gimmi-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.css']
})
export class WhatsappButtonComponent {
  @Input() message: string;
  whatsappIcon : IconDefinition = faWhatsapp;
  whatsappUrl: { [key: string] : string} = {
    web: "https://web.whatsapp.com/send?text=",
    mobile: "whatsapp://send?text="
  };

  constructor ( 
    private deviceService: DeviceDetectorService,
    private sanitizer: DomSanitizer ) {}

  generateUrl () : SafeUrl {
    let url = this.deviceService.isMobile() ? this.whatsappUrl.mobile : this.whatsappUrl.web;
    return this.sanitizer.bypassSecurityTrustUrl(url + this.message);
  }
}
