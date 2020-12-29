import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, defaultIfEmpty, map, switchMap } from 'rxjs/operators';

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
  };
  color?: string;
  size?: string;
  description?: string;
  amountWanted: number;
  reservation?: {
    reservedBy: string;
    amount: 1;
    reason: string;
    reservationDate: Date;
    handoverDate?: Date;
  },
  giftFeedback: {
    _id: string;
    satisfaction: string;
    receivedOn: Date;
    message: string;
    putBackOnlist: boolean;
  },
  closure: {
    closedBy: string;
    reason: string;
    closedOn: Date;
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
      // Create wish instances from each wish in API response and save reservation for later use and retrieve reservedBy Person object
      switchMap( wishlistResponse => forkJoin(
        wishlistResponse[0].wishes.map(wishResponse =>
          this.addReservedByToWishReservation(
            this.createWishInstanceFromResponse(wishResponse, receiver),
            wishResponse.reservation
          )
        )
      )),
      // Call method on each wish (with or without reservation) to set user flags in each instance (must be done after reservedBy is added)
      map ( wishes => wishes.map( wish => {
        wish.setUserIsFlags(this.userService.currentUser);
        return wish;
      })),
      // For each wish: get state via API call
      switchMap( wishesWithoutState => forkJoin(
        wishesWithoutState.map( wishWithoutState => this.addStateToWish(wishWithoutState) )
      )),
      // Default case if observable returns null
      defaultIfEmpty(<Wish[]>[])
    )
  }

  private addReservedByToWishReservation ( wish: Wish, reservation ) :  Observable<Wish>{
    return !reservation ? of(wish) :
      this.peopleService.getPersonById(reservation.reservedBy)
        .pipe(
          map(reservedBy => {
            if (reservedBy) wish.reservation = {
              ...reservation,
              reservedBy: new Person(reservedBy.id, reservedBy.firstName, reservedBy.lastName)
            }
            return wish;
          }),
          catchError((error: HttpErrorResponse) => {
            console.error(`[wishService] ${error}`);
            wish.reservation = { ...reservation, reservedBy: new Person(reservation.reservedBy, 'not', 'found') }
            return of(wish);
          })
        )
  }

  private addStateToWish (wishWithoutState : Wish) : Observable<Wish> {
    return this.http$.get<wishStatus>(environment.apiUrl + 'wish/' + wishWithoutState.id + '/state')
      .pipe(
        map(state => {
          wishWithoutState.status = state;
          return wishWithoutState;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(`[wishService] ${error}`);
          wishWithoutState.status = 'Open';
          return of(wishWithoutState);
        })
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