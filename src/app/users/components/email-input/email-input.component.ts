import { Component, Input, OnInit } from '@angular/core';
import { AbstractControlOptions, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { faAt } from '@fortawesome/free-solid-svg-icons'
import { PeopleService } from 'src/app/people/service/people.service';
import { IPerson } from 'src/app/people/models/person.model';

@Component({
  selector: 'gimmi-email-input',
  templateUrl: './email-input.component.html',
  styleUrls: ['./email-input.component.css']
})
export class EmailInputComponent implements OnInit {
  @Input() parentFormGroup: FormGroup;
  @Input() label: string = null;
  @Input() bindedQueryParam: string = null;
  @Input() controlName: string = 'email';
  @Input() placeholder: string = 'Email (login)';
  @Input() emailExistsValidation: boolean = false;

  mailIcon = faAt;
  knownPerson: IPerson;

  constructor(private _peopleService: PeopleService) { }

  ngOnInit(): void {
    let emailControlOptions : AbstractControlOptions = {
      validators: [Validators.required, Validators.email]
    };
    if (this.emailExistsValidation) {
      emailControlOptions.asyncValidators = this.emailExists.bind(this);
      emailControlOptions.updateOn = 'blur'
    }
    this.parentFormGroup.addControl(
      this.controlName,
      new FormControl(null, emailControlOptions)
    );
  }

  emailExists(control: FormControl): Promise<any> | Observable<any> {
    return this._peopleService.findPersonByEmail(control.value)
      .pipe(
        tap(value => this.knownPerson = value),
        map(personResult => { return { 'emailExists': true } }),
        catchError(error => { return of(null) })
      );
  }

}
