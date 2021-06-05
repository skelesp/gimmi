import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CloudinaryService } from 'src/app/images/services/cloudinary.service';
import { UserService } from 'src/app/users/service/user.service';
import { IWishImage, Wish } from 'src/app/wishes/models/wish.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'gimmi-wish-popup',
  templateUrl: './wish-popup.component.html',
  styleUrls: ['./wish-popup.component.css']
})
export class WishPopupComponent implements OnInit, OnDestroy {
  @Input() wish: Wish = new Wish(null, null, null, environment.cloudinary.defaultImage, null, null, null, null, null, null, 1);
  @Input() mode: 'edit' | 'create';
  wishForm: FormGroup;
  actionButtonText: string;
  saving: boolean = false;

  constructor(
    public activeModal : NgbActiveModal,
    public userService : UserService,
    public imageService : CloudinaryService
  ){}

  ngOnInit(): void {
    this.wishForm = new FormGroup({
      'title': new FormControl(this.wish?.title, [Validators.required]),
      'price': new FormControl(this.wish?.price),
      'image': new FormControl(this.wish?.image),
      'url': new FormControl(this.wish?.url),
      'color': new FormControl(this.wish?.color),
      'size': new FormControl(this.wish?.size),
      'description': new FormControl(this.wish?.description)
    });

    this.actionButtonText = (this.mode === 'create') ? "Wens toevoegen" : "Wens opslaan";
  }

  updateWishImage(newImage: IWishImage) {
    this.wishForm.get("image").setValue(newImage);
  }

  saveWish () {
    this.saving = true;
    let returnedWish: Wish = { ...this.wish, ...this.wishForm.value };
    this.activeModal.close(returnedWish);    
  }

  cancel () {
    this.activeModal.dismiss('Cancel');
  }

  private deleteTempWishImage ( image : IWishImage ) {
    if (this.imageService.isTemporaryImage(image)) {
      this.imageService.deleteImage(image).subscribe(result => {
        if (result) console.info(`Image ${image.publicId} is deleted from Cloudinary`);
        else console.info(`Image ${image.publicId} NOT deleted from Cloudinary`);
      })
    }
  }

  ngOnDestroy(): void {
    if (!this.saving) {
      this.deleteTempWishImage(this.wishForm.value.image);
    }
  }
}
