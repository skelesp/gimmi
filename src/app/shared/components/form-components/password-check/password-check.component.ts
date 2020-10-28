import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'gimmi-password-check',
  templateUrl: './password-check.component.html',
  styleUrls: ['./password-check.component.css']
})
export class PasswordCheckComponent implements OnInit {
  @Input() parentFormGroup : FormGroup;
  @Input() controlName : string = 'passwordGroup';

  constructor() { }

  ngOnInit(): void {
    this.parentFormGroup.addControl(this.controlName, new FormGroup({}));
  }

}
