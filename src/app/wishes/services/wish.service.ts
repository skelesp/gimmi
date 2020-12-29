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
  reservation?: IReservationResponse,
  giftFeedback: {
    _id: string;
    satisfaction: string;
    receivedOn: Date;
    message: string;
    putBackOnlist: boolean;
  },
  closure: IClosureResponse;
}

interface IReservationResponse {
  reservedBy: string;
  amount: 1;
  reason: string;
  reservationDate: Date;
  handoverDate?: Date;
}

interface IClosureResponse {
  closedBy: string;
  reason: string;
  closedOn: Date;
}

type wishStatusInResponse = 'Open' | 'Reserved' | 'Received' | 'Closed';

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
      // Create wish instances from each wish in API response and save reservation / closure for later use and retrieve reservedBy Person object
      // !! Niet de mooiste code, maar wordt toch verwijderd eenmaal de API alle personen populate in de wish zelf...
      switchMap(wishlistResponse => forkJoin(
        wishlistResponse[0].wishes.map(wishResponse => {
            let wish = this.createWishInstanceFromResponse(wishResponse, receiver);
            return forkJoin([
              this.addReservedByToWishReservation(wish ,wishResponse.reservation),
              this.addClosedByToWishClosure(wish, wishResponse.closure)
            ])
            .pipe(
            map( ([wishWithReservation, wishWithClosure]) => {
                wishWithReservation.closure = wishWithClosure.closure;
                return wishWithReservation;
              })
            );
          })
        )
      ), 
      // Call method on each wish (with or without reservation) to set user flags in each instance (must be done after reservedBy is added)
      map(wishes => wishes.map(wish => {
        wish.setUserIsFlags(this.userService.currentUser);
        return wish;
      })),
      // For each wish: get state via API call
      switchMap(wishesWithoutState => forkJoin(
        wishesWithoutState.map(wishWithoutState => this.addStateToWish(wishWithoutState))
      )),
      // Default case if observable returns null
      defaultIfEmpty(<Wish[]>[])
    )
  }

  private addReservedByToWishReservation ( wish: Wish, reservation: IReservationResponse ) :  Observable<Wish>{
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

  private addClosedByToWishClosure (wish: Wish, closure: IClosureResponse): Observable<Wish> {
    return !closure ? of(wish) :
      this.peopleService.getPersonById(closure.closedBy)
        .pipe(
          map(closedBy => {
            if (closedBy) wish.closure = {
              ...closure,
              closedBy: new Person(closedBy.id, closedBy.firstName, closedBy.lastName)
            }
            return wish;
          }),
          catchError((error: HttpErrorResponse) => {
            console.error(`[wishService] ${error}`);
            wish.closure = { ...closure, closedBy: new Person(closure.closedBy, 'not', 'found') }
            return of(wish);
          })
        )
  }

  private addStateToWish (wishWithoutState : Wish) : Observable<Wish> {
    return this.http$.get<wishStatusInResponse>(environment.apiUrl + 'wish/' + wishWithoutState.id + '/state')
      .pipe(
        map(state => {
          if (state === "Closed") wishWithoutState.status = "Fulfilled";
          else wishWithoutState.status = state;

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
    if (wishResponse.giftFeedback) wish.giftFeedback = {
      satisfaction: wishResponse.giftFeedback.satisfaction,
      receivedOn: wishResponse.giftFeedback.receivedOn,
      message: wishResponse.giftFeedback.message,
      putBackOnList: wishResponse.giftFeedback.putBackOnlist
    };
    
    return wish;
  }
}