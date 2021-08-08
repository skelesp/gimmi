import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCalendarPlus, faCheck, faComment, faExpand, faExternalLinkAlt, faGift, faListAlt, faPaintBrush, faUser } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { WishItemComponent } from '../wish-item.component';
import { WishService } from 'src/app/wishes/services/wish.service';
import { CloudinaryService } from 'src/app/images/services/cloudinary.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/users/service/user.service';
import { PeopleService } from 'src/app/people/service/people.service';
import { CommunicationService } from 'src/app/shared/services/communication.service';

@Component({
  selector: 'gimmi-wish-page',
  templateUrl: './wish-page.component.html',
  styleUrls: ['./wish-page.component.css']
})
export class WishPageComponent extends WishItemComponent implements OnInit {
  wishID: string;
  listIcon: IconDefinition = faListAlt;
  calendarIcon: IconDefinition = faCalendarPlus;
  userIcon: IconDefinition = faUser;
  linkIcon: IconDefinition = faExternalLinkAlt;
  giftIcon: IconDefinition = faGift;
  colorIcon: IconDefinition = faPaintBrush;
  sizeIcon: IconDefinition = faExpand;
  textIcon: IconDefinition = faComment;
  doneIcon: IconDefinition = faCheck;

  constructor(
    private modalSrv: NgbModal,
    private wishSrv: WishService,
    private notificationSrv: NotificationService,
    private userSrv: UserService,
    private imageSrv: CloudinaryService,
    private peopleSrv: PeopleService,
    private communicationSrv: CommunicationService,
    private route: ActivatedRoute
  ) {
    super(
      modalSrv,
      wishSrv,
      notificationSrv,
      userSrv,
      imageSrv,
      peopleSrv,
      communicationSrv
    );
  }

  ngOnInit(): void {
    this.route.data.subscribe( data => { this.wish = data.wish })
    super.ngOnInit();
  }

}