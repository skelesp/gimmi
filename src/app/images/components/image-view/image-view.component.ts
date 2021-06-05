import { Component, Input, OnInit } from '@angular/core';
import { IWishImage } from 'src/app/wishes/models/wish.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'gimmi-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.css']
})
export class ImageViewComponent implements OnInit {
  @Input() image : IWishImage = environment.cloudinary.defaultImage;
  @Input() class : string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
