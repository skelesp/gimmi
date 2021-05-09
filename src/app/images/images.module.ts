import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import * as Cloudinary from "cloudinary-core";
import { environment } from 'src/environments/environment';
import { ImageUploadComponent } from './image-upload/image-upload.component';

@NgModule({
  declarations: [ImageUploadComponent],
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
    ImageUploadComponent
  ]
})
export class ImagesModule { }
