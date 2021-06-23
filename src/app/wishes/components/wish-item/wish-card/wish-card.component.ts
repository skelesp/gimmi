import { Component } from '@angular/core';
import { WishItemComponent } from '../wish-item.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WishService } from 'src/app/wishes/services/wish.service';
import { CloudinaryService } from 'src/app/images/services/cloudinary.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/users/service/user.service';

@Component({
  selector: 'gimmi-wish-card',
  templateUrl: './wish-card.component.html',
  styleUrls: ['./wish-card.component.css']
})
export class WishCardComponent extends WishItemComponent {

  constructor(
    private modalSrv: NgbModal,
    private wishSrv: WishService,
    private notificationSrv: NotificationService,
    private userSrv: UserService,
    private imageSrv: CloudinaryService
  ) {
    super(
      modalSrv, 
      wishSrv, 
      notificationSrv, 
      userSrv,
      imageSrv
      );
  }

}
