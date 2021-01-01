import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Person } from 'src/app/people/models/person.model';
import { UserService } from 'src/app/users/service/user.service';
import { IReservation, Wish } from '../../models/wish.model';

@Component({
  selector: 'gimmi-wish-reservation',
  templateUrl: './wish-reservation.component.html',
  styleUrls: ['./wish-reservation.component.css']
})
export class WishReservationComponent implements OnInit {
  @Input() wish: Wish;
  reservationForm: FormGroup;
  readonly reasonOptions: string[] = ['Verjaardag', 'Sinterklaas', 'Kerstmis', 'Nieuwjaar', 'Housewarming', 'Geboorte', 'Huwelijk', 'Afscheid collega', 'Afscheid', 'Communie / Lentefeest', 'Vader/moederdag', 'Andere reden']

  constructor( 
    public activeModal: NgbActiveModal,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.reservationForm = new FormGroup({
      'handoverDate': new FormControl(new Date().toISOString().substring(0, 10), Validators.required), //https://stackoverflow.com/questions/45330319/angular2-setting-date-field-on-reactive-form
      'reason': new FormControl(null, Validators.required)
    })
  }

  saveReservation() {
    let reservation: IReservation = { 
      reason: this.reservationForm.value.reason,
      handoverDate: new Date(this.reservationForm.value.handoverDate),
      amount: 1,
      reservedBy: new Person(
        this.userService.currentUser.id, 
        this.userService.currentUser.firstName, 
        this.userService.currentUser.lastName
        ),
      reservationDate: new Date()
    }
    console.log(reservation);
  }

}
