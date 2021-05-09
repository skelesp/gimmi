import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'gimmi-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  private uploadWidget : any = null;
  private uploadWidgetConfig: any = {
    cloud_name: environment.cloudinary.cloud_name,
    uploadPreset: environment.cloudinary.uploadPreset,
    secure: true,
    language: "nl",
    sources: ['local', 'image_search', 'url'],
    defaultSource: "image_search",
    googleApiKey: environment.googleApi.googleApiKey,
    resourceType: "image",
    multiple: false,
    theme: "minimal",
    showPoweredBy: false, //Note: Supported only for paid Cloudinary accounts and requires some time for cache expiration.
    showAdvancedOptions: false,
    showCompletedButton: false,
    text: environment.cloudinary.uploadWidget.text
  };

  constructor() { }

  ngOnInit(): void {
    this.uploadWidget = (window as any).cloudinary.createUploadWidget(
      this.uploadWidgetConfig,
      (error, result) => {
        console.error(error);
        console.log(result);
      }
    )
  }

  openUploadWidget($event) {
    this.uploadWidget.open();
    console.log("Open upload button is clicked!", $event);
  }

}
