import { Component, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { ICloudinaryImage } from '../../models/wish.model';

@Component({
  selector: 'gimmi-wish-create-card',
  templateUrl: './wish-create-card.component.html',
  styleUrls: ['./wish-create-card.component.css']
})
export class WishCreateCardComponent implements OnInit {
  image : ICloudinaryImage = {
    publicId: environment.cloudinary.defaultImage.publicId,
    version: environment.cloudinary.defaultImage.version
  }
  plusIcon : IconDefinition = faPlus;

  constructor() { }

  ngOnInit(): void {
  }

}
