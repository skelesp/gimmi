import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { INewUserRequestInfo, User } from '../../models/user.model';
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

  constructor( private userService : UserService) { }

  ngOnInit(): void {
    this.invitedFor = null; // Wordt pas geïmplementeerd als wishlist geïmplementeerd worden.
    this.registrationForm = new FormGroup ({
      'personData': new FormGroup({
        'firstName': new FormControl(null, Validators.required),
        'lastName': new FormControl(null, Validators.required),
        'birthday': new FormControl(null, Validators.required)
      }),
      'localAccountData': new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, [Validators.required])
      })
    });
  }

  register () {
    let newUser : INewUserRequestInfo = {
      firstname: this.registrationForm.get('personData.firstName').value,
      lastname: this.registrationForm.get('personData.lastName').value,
      birthday: this.registrationForm.get('personData.birthday').value,
      email: this.registrationForm.get('localAccountData.email').value,
      password: this.registrationForm.get('localAccountData.password').value
    };
    this.userService.register( newUser).subscribe(
      user => {
        // Form handling
        this.registrationForm.reset();

        this.userService.showAuthenticationConfirmation();
        this.userService.redirectAfterAuthentication();
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
