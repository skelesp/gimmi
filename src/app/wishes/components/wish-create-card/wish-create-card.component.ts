import { Component, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ICloudinaryImage } from '../../models/wish.model';
import { WishPopupComponent } from '../wish-item/wish-popup/wish-popup.component';

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

  constructor( private modalService : NgbModal) { }

  ngOnInit(): void {
  }

  openCreateWish () {
    let wishCreatePopup = this.modalService.open(WishPopupComponent);
    wishCreatePopup.componentInstance.mode = 'create';

    wishCreatePopup.result
      .then( wish => {
        console.info('Wish to create', wish);
        // TODO: 
      })
      .catch( reason => this.handlePopupDismissal(reason) );
  }

  private handlePopupDismissal (reason : any) : void {
    if (reason === ModalDismissReasons.ESC) reason = 'ESC pressed';
    else if (reason === ModalDismissReasons.BACKDROP_CLICK) reason = 'Backdrop click';

    console.warn(`Wish Create popup is closed: ${reason}`);
  }

}
