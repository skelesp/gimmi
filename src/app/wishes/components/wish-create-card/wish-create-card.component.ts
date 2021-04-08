import { Component, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
        // TODO: Add the following data: createdBy (currentUser), receiver (current list owner), amountWanted (1)
        // ==> Misschien beter in wish create service method toevoegen? Maar service kent geen context, dus moet dan doorgegeven worden
        // ZIE OUDE CODE
      })
      .catch();
  }

}
