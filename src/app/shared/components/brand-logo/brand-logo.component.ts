import { Component, Input } from '@angular/core';

@Component({
  selector: 'gimmi-brand-logo',
  templateUrl: './brand-logo.component.html',
  styleUrls: ['./brand-logo.component.css']
})
export class BrandLogoComponent {
  @Input() link?: string[] = ["/"];

}
