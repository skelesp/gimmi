import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { InvitePersonData, PeopleService } from '../../service/people.service';

@Component({
  selector: 'gimmi-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  mailIcon = faEnvelope;
  invitationForm: FormGroup;

  constructor(private _peopleService: PeopleService) { }

  ngOnInit(): void {
    this.invitationForm = new FormGroup({
      'invitationData': new FormGroup({
        'notifyOnRegistration': new FormControl(false)
      })
    });
  }

  invitePerson() {
    let inviteInfo: InvitePersonData = {
      email: this.invitationForm.value.invitationData.emailaddress,
      notifyOnRegistration: this.invitationForm.value.invitationData.notifyOnRegistration
    }
    this._peopleService.invite(inviteInfo);    
    this.invitationForm.reset();
  }
}
