import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IPersonSearchResponse, Person } from 'src/app/people/models/person.model';
import { UserService } from 'src/app/users/service/user.service';
import { environment } from 'src/environments/environment';
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
    private userService : UserService
  ) { }
  
  public getWishlist ( receiver : Person) : Observable<Wish[]>{
    let wishes: Wish[] = [];
    return this.http$.get<IWishlistResponse[]>(environment.apiUrl + 'wishlist/' + receiver.id).pipe(
      map( (response) => {
        response[0].wishes.forEach((wish) => {
          
          let newWish : Wish = new Wish(
            wish._id,
            wish.title,
            wish.price,
            {
              publicId: wish.image.public_id,
              version: wish.image.version.toString()
            },
            wish.url,
            receiver,
            new Person ( wish.createdBy._id, wish.createdBy.firstName, wish.createdBy.lastName ),
            wish.color,
            wish.size,
            wish.description,
            wish.amountWanted
          );
          newWish.reservation = wish.reservation;          
          newWish.setUserIsFlags(this.userService.currentUser);
          
          wishes.push(newWish);
        });

        return wishes;
      }),
      switchMap( (wishes) => {
        let wishStateObservables = wishes.map(wish => this.http$.get<wishStatus>(environment.apiUrl + 'wish/' + wish.id + '/state')
          .pipe(catchError(() => of(null))));
        return wishes.length !== 0 ? forkJoin(wishStateObservables) : of(null); // https://stackoverflow.com/questions/41723541/rxjs-switchmap-not-emitting-value-if-the-input-observable-is-empty-array
      }),
      map( states => {
        if (states) {
          states.forEach((state, index) => {
            wishes[index].status = state === 'Closed' ? 'Fulfilled': state;
          });
        } else {
          wishes = [];
        }
        return wishes;
      })      
    );

  }

}
