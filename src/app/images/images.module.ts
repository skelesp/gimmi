import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import * as Cloudinary from "cloudinary-core";
import { environment } from 'src/environments/environment';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CloudinaryModule.forRoot(Cloudinary, {
      cloud_name: environment.cloudinary.sdk.cloud_name,
      upload_preset: environment.cloudinary.sdk.uploadPreset,
      secure: true
    } as CloudinaryConfiguration),
  ],
  exports: [
    CloudinaryModule
  ]
})
export class ImagesModule { }
