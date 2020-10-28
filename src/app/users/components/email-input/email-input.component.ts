import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faAt } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'gimmi-email-input',
  templateUrl: './email-input.component.html',
  styleUrls: ['./email-input.component.css']
})
export class EmailInputComponent implements OnInit {
  @Input() parentFormGroup: FormGroup;
  @Input() label: string = null;
  mailIcon = faAt;

  constructor() { }

  ngOnInit(): void {
    this.parentFormGroup.addControl( 'email', new FormControl(null, [Validators.required, Validators.email]));
  }

}
