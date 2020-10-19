import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { PeopleService, InvitePersonData } from '../../service/people.service';
import { catchError, map, tap } from 'rxjs/operators';
import { IPerson } from '../../models/person.model';

@Component({
  selector: 'gimmi-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  mailIcon = faEnvelope;
  invitationForm: FormGroup;
  knownPerson: IPerson;

  constructor ( private _peopleService: PeopleService) {}

  ngOnInit(): void {
    this.invitationForm = new FormGroup({
      'invitationData': new FormGroup({
        'emailaddress': new FormControl(null, {
          validators: [Validators.required, Validators.email], 
          asyncValidators: this.emailExists.bind(this),
          updateOn: 'blur'
        } ),
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

  emailExists(control : FormControl) : Promise<any> | Observable<any> {
    return this._peopleService.findPersonByEmail(control.value)
      .pipe(
        tap(value => this.knownPerson = value),
        map (personResult => { return {'emailExists' : true} } ),
        catchError( error => { return of(null) })
      );
  }
}
