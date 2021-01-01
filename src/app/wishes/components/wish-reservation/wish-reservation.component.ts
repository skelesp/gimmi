import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'gimmi-wish-reservation',
  templateUrl: './wish-reservation.component.html',
  styleUrls: ['./wish-reservation.component.css']
})
export class WishReservationComponent implements OnInit {
  reservationForm: FormGroup;
  readonly reasonOptions: string[] = ['Verjaardag', 'Sinterklaas', 'Kerstmis', 'Nieuwjaar', 'Housewarming', 'Geboorte', 'Huwelijk', 'Afscheid collega', 'Afscheid', 'Communie / Lentefeest', 'Vader/moederdag', 'Andere reden']

  constructor( public activeModal: NgbActiveModal ) { }

  ngOnInit(): void {
    this.reservationForm = new FormGroup({
      'handoverDate': new FormControl(new Date().toISOString().substring(0, 10), Validators.required), //https://stackoverflow.com/questions/45330319/angular2-setting-date-field-on-reactive-form
      'reason': new FormControl(null, Validators.required)
    })
  }

  saveReservation() {
    console.log(this.reservationForm.value);
  }

}
