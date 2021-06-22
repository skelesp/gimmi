import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import * as Cloudinary from "cloudinary-core";
import { environment } from 'src/environments/environment';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ImageViewComponent } from './components/image-view/image-view.component';

@NgModule({
  declarations: [ImageUploadComponent, ImageViewComponent],
  imports: [
    CommonModule,
    CloudinaryModule.forRoot(Cloudinary, {
      cloud_name: environment.cloudinary.cloud_name,
      upload_preset: environment.cloudinary.uploadPreset,
      secure: true
    } as CloudinaryConfiguration),
  ],
  exports: [
    CloudinaryModule,
    ImageUploadComponent,
    ImageViewComponent
  ]
})
export class ImagesModule { }
