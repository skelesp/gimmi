import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, BehaviorSubject } from 'rxjs';
import { catchError, defaultIfEmpty, map, switchMap, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Person } from 'src/app/people/models/person.model';
import { IPersonNameResponse, IPersonSearchResponse, PeopleService } from 'src/app/people/service/people.service';
import { UserService } from 'src/app/users/service/user.service';
import { IClosure, IGiftFeedback, IReservation, Wish, wishStatus } from '../models/wish.model';
import { CloudinaryService } from 'src/app/images/services/cloudinary.service';

interface IWishlistResponse {
  _id: {
    receiver: IPersonSearchResponse
  };
  wishes: IWishResponse[];
  count: number;
}

interface IWishResponse {
  _id: string;
  receiver: string;
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
  };
  color?: string;
  size?: string;
  description?: string;
  amountWanted: number;
  reservation?: IReservationResponse,
  giftFeedback?: {
    _id: string;
    satisfaction: string;
    receivedOn: Date;
    message: string;
    putBackOnList: boolean;
  },
  closure?: IClosureResponse;
}

interface IWishReservationResponse {
  receiver: string;
  _id: string;
  title: string;
  image: {
    version: number;
    public_id: string;
  };
  price?: number;
  url?: string;
  createdBy: IPersonNameResponse;
  color?: string;
  size?: string;
  description?: string;
  amountWanted: number;
  reservation: {
    reservedBy: IPersonNameResponse,
    amount: number;
    reason: string;
    reservationDate: Date;
    handoverDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
    id: string;
  }
}

interface IWishFeedbackResponse extends IWishReservationResponse {
  giftFeedback: IGiftFeedbackResponse
}

interface IWishClosureResponse extends IWishFeedbackResponse {
  closure: IClosureResponse
}

interface IReservationResponse {
  reservedBy: string;
  amount: number;
  reason: string;
  reservationDate: Date;
  handoverDate?: Date;
}

interface IGiftFeedbackResponse {
  message: string,
  putBackOnList: boolean,
  receivedOn: Date,
  satisfaction: string
}

interface IClosureResponse {
  closedBy: string;
  reason: string;
  closedOn: Date;
}

interface IWishRequest {
  id: string;
  title: string;
  price: number;
  image: {
    public_id: string; 
    version: number
  };
  reservation: IReservation;
  giftFeedback: IGiftFeedback;
  closure: IClosure;
  copyOf: string;
  url: string;
  receiver: Person;
  createdBy: Person;
  color: string;
  size: string;
  description: string;
  amountWanted: number;
  _id: string;
}

interface IWishCreateRequest {
  title: string;
  price: number;
  url: string;
  color: string;
  size: string;
  description: string;
  receiver: string;
  createdBy: string;
  amountWanted: number;
  image: {
    public_id: string;
    version: number
  };
}

type wishStatusInResponse = 'Open' | 'Reserved' | 'Received' | 'Closed';

@Injectable({
  providedIn: 'root'
})
export class WishService {
  private _wishes$: BehaviorSubject<Wish[]> = new BehaviorSubject<Wish[]>([]);
  public readonly wishes: Observable<Wish[]> = this._wishes$.asObservable();

  constructor(
    private http$ : HttpClient,
    private userService : UserService,
    private peopleService : PeopleService,
    private imageService: CloudinaryService
  ) { }

  public getWishlist(receiver: Person): Observable<Wish[]> { //https://stackoverflow.com/questions/65417031/rxjs-how-to-make-foreach-loop-wait-for-inner-observable
    return this.http$.get<IWishlistResponse[]>(
      environment.apiUrl + 'wishlist/' + receiver.id
    ).pipe(
      // Create wish instances from each wish in API response and save reservation / closure for later use and retrieve reservedBy Person object
      switchMap(wishlistResponse => forkJoin(
        wishlistResponse[0].wishes.map(wishResponse => this.convertWishResponseToFullWishInstance(wishResponse, receiver))
        )
      ),
      // Default case if wishlist is empty
      defaultIfEmpty(<Wish[]>[]),
      tap(wishes => this._wishes$.next(wishes))
    );
  }

  public updateWishInWishlist ( updatedWish: Wish ) : void {
    let currentWishlist = [...this._wishes$.value]; //spread operator passes a copy of the array, so change detection will detect this change.
    if (currentWishlist.length !== 0) {
      let index = currentWishlist.findIndex(item => item.id === updatedWish.id);
      currentWishlist[index] = updatedWish;
    }
    this._wishes$.next(currentWishlist);
  }

  public addReservation(wish: Wish, reservation: IReservation) : Observable<Wish>{
    let reservationRequestData: IReservationResponse = { ...reservation, reservedBy: reservation.reservedBy.id };

    return this.http$.post<IWishReservationResponse>(
      environment.apiUrl + 'wish/' + wish.id + '/reservation', 
      reservationRequestData
    ).pipe(
      switchMap(wishReservationResponse => this.convertWishReservationResponseToUpdatedWish(wishReservationResponse, wish))
    )
  }

  public deleteReservation(wish: Wish) : Observable<Wish>{
    return this.http$.delete<IWishReservationResponse>(
      environment.apiUrl + 'wish/' + wish.id + '/reservation'
    ).pipe(
      switchMap(reservationDeleteResponse => this.convertWishReservationResponseToUpdatedWish(reservationDeleteResponse, wish))
    );
  }

  public copy () {
    alert("Copy isn't implemented yet");
  }

  public delete (wish: Wish) : Observable<Wish>{
    return this.http$.delete<IWishResponse>(
      environment.apiUrl + 'wish/' + wish.id
    ).pipe(
      map(wishResponse => this.createBasicWishInstanceFromResponse(wishResponse, wish.receiver)),
      tap(wish => this.deleteWishFromWishlist(wish) ),
      tap(wish => this.imageService.deleteImage(wish.image).subscribe())
    );
  }

  public addGiftFeedback (wish: Wish, giftFeedback: IGiftFeedback) : Observable<Wish> {
    return this.http$.post<IWishFeedbackResponse>(
      environment.apiUrl + 'wish/' + wish.id + "/feedback", 
      giftFeedback
    ).pipe(
      switchMap(addFeedbackResponse => this.convertWishReservationResponseToUpdatedWish(addFeedbackResponse, wish))
    )
  }
  
  public create ( newWish : Wish) : Observable<Wish>{
    let wishCreatePayload : IWishCreateRequest = {
      title: newWish.title,
      price: newWish.price,
      url: newWish.url,
      color: newWish.color,
      size: newWish.size,
      description: newWish.description,
      receiver: newWish.receiver.id,
      createdBy: newWish.createdBy.id,
      amountWanted: newWish.amountWanted,
      image: {
        public_id: newWish.image.publicId,
        version: +newWish.image.version
      }
    }
    return this.http$.post<IWishResponse>(
      environment.apiUrl + "wish",
      wishCreatePayload 
    ).pipe(
      switchMap(wishResponse => this.convertWishResponseToFullWishInstance(wishResponse, newWish.receiver)),
      switchMap(wish => this.imageService.renameImage(wish.image.publicId, wish.id).pipe(
        map(newImage => {
          wish.image = newImage;
          return wish;
        }),
        tap(wish => this.addWishToWishlist(wish)),
        switchMap(wish => this.update(wish))
      ))
    )
  }

  public update ( wish : Wish ) : Observable<Wish>{
    let wishRequest : IWishRequest = {
      ...wish, 
      _id: wish.id,
      receiver: wish.receiver,
      image : {public_id: wish.image.publicId, version: +wish.image.version}};
    return this.http$.put<IWishReservationResponse>(
      environment.apiUrl + 'wish/' + wish.id,
      wishRequest
    )
    .pipe(
      switchMap(updatedWish => this.convertWishReservationResponseToUpdatedWish(updatedWish, wish))
    );
  }

  public close (wish: Wish) : Observable<Wish>{
    let closure: IClosureResponse = {
      closedBy: this.userService.currentUser.id,
      closedOn: new Date(),
      reason: "Cadeau ontvangen"
    }
    return this.http$.post<IWishClosureResponse>(
      environment.apiUrl + 'wish/' + wish.id + "/closure",
      closure
    ).pipe(
      switchMap(wishClosureResponse => this.convertWishReservationResponseToUpdatedWish(wishClosureResponse, wish))
    )
  }

  /* PRIVATE methods */
  private addWishToWishlist ( newWish : Wish) : void {
    let wishlist = this._wishes$.value;
    wishlist.unshift(newWish);
    this._wishes$.next(wishlist);
  }

  private deleteWishFromWishlist (deletedWish : Wish) {
    let filteredWishlist = this._wishes$.value.filter( wish => {
      return wish.id !== deletedWish.id;
    }); // Filter always returns copy of array
    
    this._wishes$.next(filteredWishlist);
  }

  private convertWishReservationResponseToUpdatedWish (wishReservationResponse: IWishReservationResponse, wish: Wish) : Observable<Wish>{
    return of(wishReservationResponse).pipe(
      // !! Dit is een nutteloze actie puur om ervoor te zorgen dat de wishResponse van deze call gelijk is aan deze van de getWishlist
      map(wishResponse => {
        let newWishResponse: any = { ...wishResponse };
        if (newWishResponse.reservation)
          newWishResponse.reservation.reservedBy = newWishResponse.reservation.reservedBy.id;
        return newWishResponse;
      }),
      switchMap(wishResponse => this.convertWishResponseToFullWishInstance(wishResponse, wish.receiver)
      ),
      tap(wish => this.updateWishInWishlist(wish))
    )
  }

  private convertWishResponseToFullWishInstance(wishResponse : IWishResponse, receiver : Person) : Observable<Wish>{
    // Create wish without reservation and closure
    let wish = this.createBasicWishInstanceFromResponse(wishResponse, receiver);
    // Fetch Person corresponding to closedBy and reservedBy objectID's
    // !! This can be avoided if the API returns fully populated wish object...
    return forkJoin([
      of(wish),
      this.getFullReservationInfo(wishResponse.reservation),
      this.getFullClosureInfo(wishResponse.closure)
    ])
    .pipe(
      // Add full closure and reservation info into wish
      map(([wish, reservationWithReservedByPerson, closureWithClosedByPerson]) => {
        if(reservationWithReservedByPerson) wish.reservation = reservationWithReservedByPerson;
        if(closureWithClosedByPerson) wish.closure = closureWithClosedByPerson;
        return wish;
      }),
      // Get state via API call
      // !! Dit wordt overbodig als de API de state al in de cal meegeeft
      switchMap( wish => this.addStateToWish(wish)),
      // Call method to set user flags in each instance (must be done after reservedBy is added and status is retrieved)
      map ( wish => {
        wish.setUserIsFlags(this.userService.currentUser)
        return wish;
      })
    );
  }

  private getFullReservationInfo ( reservation: IReservationResponse ) :  Observable<IReservation>{
    let completeReservation : IReservation;
    return (!reservation || !reservation.reservedBy) ? of(null) :
      this.peopleService.getPersonById(reservation.reservedBy)
        .pipe(
          map(reservedBy => {
            if (reservedBy) completeReservation = {
              ...reservation,
              reservedBy: new Person(reservedBy.id, reservedBy.firstName, reservedBy.lastName)
            }
            return completeReservation;
          }),
          catchError((error: HttpErrorResponse) => {
            console.error(`[wishService] ReservedBy ID not found`);
            return of({ ...reservation, reservedBy: new Person(reservation.reservedBy, 'not', 'found') });
          })
        )
  }

  private getFullClosureInfo (closure: IClosureResponse): Observable<IClosure> {
    let completeClosure : IClosure;
    return (!closure || !closure.closedBy) ? of(null) :
      this.peopleService.getPersonById(closure.closedBy)
        .pipe(
          map(closedBy => {
            if (closedBy) completeClosure = {
              ...closure,
              closedBy: new Person(closedBy.id, closedBy.firstName, closedBy.lastName)
            }
            return completeClosure;
          }),
          catchError((error: HttpErrorResponse) => {
            console.error(`[wishService] ClosedBy ID not found`);
            return of({ ...closure, closedBy: new Person(closure.closedBy, 'not', 'found') });
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
  
  private createBasicWishInstanceFromResponse ( wishResponse : IWishResponse, receiver: Person ) : Wish {
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
      putBackOnList: wishResponse.giftFeedback.putBackOnList
    };
    
    return wish;
  }
}