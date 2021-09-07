import { Component, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharePopupComponent } from './share-popup/share-popup.component';

@Component({
  selector: 'gimmi-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  shareIcon: IconDefinition = faShareAlt;

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  activate() {
    this.modalService.open(SharePopupComponent);
  }

}
