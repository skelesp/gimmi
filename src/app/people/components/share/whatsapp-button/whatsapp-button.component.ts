import { Component, Input} from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'gimmi-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.css']
})
export class WhatsappButtonComponent {
  @Input() message: string;
  whatsappIcon : IconDefinition = faWhatsapp;
  url: string = "https://web.whatsapp.com/send?text=";
}
