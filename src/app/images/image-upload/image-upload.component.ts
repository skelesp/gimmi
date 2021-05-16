import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICloudinaryImage } from 'src/app/wishes/models/wish.model';
import { environment } from 'src/environments/environment';
import { CloudinaryService } from '../services/cloudinary.service';

@Component({
  selector: 'gimmi-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  @Input() publicId : string;
  @Input() tempPublicId_prefix: string = "";
  @Input() tempPublicId_postfix: string = environment.cloudinary.temporaryImagePostfix;

  @Output() imageUploaded: EventEmitter<ICloudinaryImage> = new EventEmitter();
  private uploadWidget : any = null;
  private uploadWidgetConfig: any = {
    cloud_name: environment.cloudinary.cloud_name,
    uploadPreset: environment.cloudinary.uploadPreset,
    api_key: environment.cloudinary.apiKey,
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

  constructor( private cloudinaryService : CloudinaryService) { }

  ngOnInit(): void {
    this.uploadWidgetConfig.uploadSignature = this.cloudinaryService.getSignature.bind(this.cloudinaryService);
  }

  openUploadWidget() {
    this.uploadWidgetConfig.publicId = this.publicId ? this.publicId : this.cloudinaryService.generateRandomPublicId(this.tempPublicId_prefix, this.tempPublicId_postfix);

    this.uploadWidget = (window as any).cloudinary.openUploadWidget(
      this.uploadWidgetConfig,
      (error, result) => {
        if (error) {
          console.error(error);
          return;
        } else if (result && result.event === "success") {
          this.imageUploaded.emit({
            publicId: result.info.public_id,
            version: result.info.version
          });
          this.uploadWidget.close({ quiet: true });
        }
      }
    );
  }

}
