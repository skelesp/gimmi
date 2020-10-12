import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'gimmi-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  mailIcon = faEnvelope;
  @ViewChild('invitationForm') invitationForm: NgForm;

  constructor() { }

  ngOnInit(): void {
  }

  invitePerson() {
    console.log(this.invitationForm);
    this.invitationForm.reset();
  }
}
