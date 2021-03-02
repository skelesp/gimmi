import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Wish } from 'src/app/wishes/models/wish.model';

@Component({
  selector: 'gimmi-wish-popup',
  templateUrl: './wish-popup.component.html',
  styleUrls: ['./wish-popup.component.css']
})
export class WishPopupComponent implements OnInit {
  @Input() wish : Wish;
  wishForm: FormGroup;

  constructor(
    public activeModal : NgbActiveModal
  ){}

  ngOnInit(): void {
    this.wishForm = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'price': new FormControl(null),
      'image': new FormControl(null),
      'url': new FormControl(null),
      'color': new FormControl(null),
      'size': new FormControl(null),
      'description': new FormControl(null),
    });
  }
  updateWish () {
    console.log(this.wishForm.value);
  }

}
