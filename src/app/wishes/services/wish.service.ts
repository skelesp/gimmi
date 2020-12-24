import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Person } from 'src/app/people/models/person.model';
import { IPersonSearchResponse, PeopleService } from 'src/app/people/service/people.service';
import { UserService } from 'src/app/users/service/user.service';
import { Wish, wishStatus } from '../models/wish.model';

interface IWishlistResponse {
  _id: {
    receiver: IPersonSearchResponse
  };
  wishes: IWishResponse[];
  count: number;
}

interface IWishResponse {
  _id: string;
  title: string;
  image: {
    version: number;
    public_id: string;
  };
  price?: number;
  url?: string;
  createdBy: {
    _id: string;
    firstName:string;
    lastName: string;
    birthday: Date;
  },
  color?: string,
  size?: string,
  description?: string,
  amountWanted: number,
  reservation?: {
    reservedBy: string,
    amount: 1,
    reason: string,
    reservationDate: Date,
    handoverDate?: Date
  }
}

@Injectable({
  providedIn: 'root'
})
export class WishService {

  constructor(
    private http$ : HttpClient,
    private userService : UserService,
    private peopleService : PeopleService
  ) { }

  public getWishlist(receiver: Person): Observable<Wish[]> { //https://stackoverflow.com/questions/65417031/rxjs-how-to-make-foreach-loop-wait-for-inner-observable
    return this.http$.get<IWishlistResponse[]>(
      environment.apiUrl + 'wishlist/' + receiver.id
    ).pipe(
      // Create wish instances from each wish in API response and save reservation for later use
      map( wishlistResponse => 
        wishlistResponse[0].wishes.map(wish => ({
          wish: this.createWishInstanceFromResponse(wish, receiver),
          reservation: wish.reservation
        }))),
      // For each wish with reservation: get person info for 'reservedBy' id
      map( wishesAndReservationObjects => wishesAndReservationObjects.map( ({wish, reservation}) => 
        !reservation ? 
        of(wish) : 
        this.peopleService.getPersonById(reservation.reservedBy)
        .pipe(
          map ( reservedBy => {
            if (reservedBy) wish.reservation = { 
              ...reservation,   
              reservedBy: new Person(reservedBy.id, reservedBy.firstName, reservedBy.lastName)
            }
            return wish;
          }),
          catchError( (error : HttpErrorResponse) => {
            console.error(`[wishService] ${error}`);
            wish.reservation = {...reservation, reservedBy: new Person(reservation.reservedBy, 'not', 'found')}
            return of(wish);
          })
        )
       )),
      // forkJoin all observables, so the result is an array of all the wishes
      switchMap(reservedByObservables => reservedByObservables.length !== 0 ? forkJoin(reservedByObservables) : of(<Wish[]>[])), //https://stackoverflow.com/questions/41723541/rxjs-switchmap-not-emitting-value-if-the-input-observable-is-empty-array
      // Call method on each wish (with or without reservation) to set user flags in each instance (must be done after reservedBy is added)
      map ( wishes => wishes.map( wish => {
        wish.setUserIsFlags(this.userService.currentUser);
        return wish;
      })),
      // For each wish: get state via API call
      map ( wishesWithoutState => wishesWithoutState.map( wishWithoutState => 
        this.http$.get<wishStatus>(environment.apiUrl + 'wish/' + wishWithoutState.id + '/state')
        .pipe(
          map( state => {
            wishWithoutState.status = state;
            return wishWithoutState;
          }),
          catchError((error: HttpErrorResponse) => {
            console.error(`[wishService] ${error}`);
            wishWithoutState.status = 'Open';
            return of(wishWithoutState);
          })
        )
      )),
      // Combine all stateObservables into 1 array
      switchMap(stateObservables => stateObservables.length !== 0 ? forkJoin(stateObservables) : of(<Wish[]>[]))
    )
  }

  private createWishInstanceFromResponse ( wishResponse : IWishResponse, receiver: Person ) : Wish {
    let wish : Wish = new Wish (
      wishResponse._id,
      wishResponse.title,
      wishResponse.price,
      {publicId: wishResponse.image.public_id, version: wishResponse.image.version.toString()},
      wishResponse.url,
      receiver,
      new Person(wishResponse.createdBy._id, wishResponse.createdBy.firstName, wishResponse.createdBy.lastName),
      wishResponse.color,
      wishResponse.size,
      wishResponse.description,
      wishResponse.amountWanted
    );
    return wish;
  }
}