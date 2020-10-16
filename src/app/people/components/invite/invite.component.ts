import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { PeopleService } from '../../service/people.service';

@Component({
  selector: 'gimmi-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  mailIcon = faEnvelope;
  invitationForm: FormGroup;

  constructor ( private peopleService: PeopleService) {}

  ngOnInit(): void {
    this.invitationForm = new FormGroup({
      'invitationData': new FormGroup({
        'emailaddress': new FormControl(null, [Validators.required, Validators.email]),
        'notifyOnRegistration': new FormControl(false)
      })
    });
  }

  invitePerson() {
    this.peopleService.invite(this.invitationForm.value.invitationData.emailaddress);    
    this.invitationForm.reset();
  }
}
