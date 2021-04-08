import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Wish } from 'src/app/wishes/models/wish.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'gimmi-wish-popup',
  templateUrl: './wish-popup.component.html',
  styleUrls: ['./wish-popup.component.css']
})
export class WishPopupComponent implements OnInit {
  @Input() wish: Wish = new Wish(null, null, null, environment.cloudinary.defaultImage, null, null, null, null, null, null, null);
  @Input() mode: 'edit' | 'create';
  wishForm: FormGroup;
  actionButtonText: string;

  constructor(
    public activeModal : NgbActiveModal
  ){}

  ngOnInit(): void {
    this.wishForm = new FormGroup({
      'title': new FormControl(this.wish?.title, [Validators.required]),
      'price': new FormControl(this.wish?.price),
      'image': new FormControl(this.wish?.image),
      'url': new FormControl(this.wish?.url),
      'color': new FormControl(this.wish?.color),
      'size': new FormControl(this.wish?.size),
      'description': new FormControl(this.wish?.description)
    });

    this.actionButtonText = (this.mode === 'create') ? "Wens toevoegen" : "Wens opslaan";
  }
  saveWish () {
    let returnedWish: Wish = { ...this.wish, ...this.wishForm.value };
    this.activeModal.close(returnedWish);    
  }

}
