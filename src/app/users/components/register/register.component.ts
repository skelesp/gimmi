import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';

@Component({
  selector: 'gimmi-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  invitedFor: string;
  knownUser: User;
  registrationForm: FormGroup;

  constructor() { }

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
    console.log(this.registrationForm.value);
  }

}
