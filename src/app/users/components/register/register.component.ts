import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PeopleService } from 'src/app/people/service/people.service';
import { INewUserRequestInfo } from '../../models/user.model';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'gimmi-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  invitedFor: string;
  knownUser: boolean;
  registrationForm: FormGroup;
  infoAlertClosed: boolean;

  constructor( 
    private userService : UserService,
    private peopleService : PeopleService
  ) { }

  ngOnInit(): void {
    this.invitedFor = null; // Wordt pas geïmplementeerd als wishlist geïmplementeerd worden.
    this.registrationForm = new FormGroup ({
      'personData': new FormGroup({
        'firstName': new FormControl(null, Validators.required),
        'lastName': new FormControl(null, Validators.required),
        'birthday': new FormControl(null, Validators.required)
      }),
      'localAccountData': new FormGroup({})
    });
  }

  register () {
    let newUser : INewUserRequestInfo = {
      firstname: this.registrationForm.value.personData.firstName,
      lastname: this.registrationForm.value.personData.lastName,
      birthday: this.registrationForm.value.personData.birthday,
      email: this.registrationForm.value.localAccountData.email,
      password: this.registrationForm.value.localAccountData.passwordGroup.password
    };
    this.userService.register( newUser).subscribe(
      user => {
        // Form handling
        this.registrationForm.reset();

        this.userService.showAuthenticationConfirmation();
        this.userService.redirectAfterAuthentication();
        this.peopleService.addPerson({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}` 
        })
      },
      error => {
        if (error.indexOf('User already exists') !== -1) {
          this.knownUser = true;
        }
        console.error(error);
      }
    );
  }

}
