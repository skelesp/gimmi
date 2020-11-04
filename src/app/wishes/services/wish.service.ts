import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Person } from 'src/app/people/models/person.model';
import { environment } from 'src/environments/environment';
import { Wish, wishStatus } from '../models/wish.model';

interface IWishlistResponse {
  _id: {
    receiver: {
      _id: string;
      firstName: string;
      lastName: string;
      birthday: Date;
    }
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
  price: number;
  url: string;
  createdBy: {
    _id: string;
    firstName:string;
    lastName: string;
    birthday: Date;
  }
}

@Injectable({
  providedIn: 'root'
})
export class WishService {

  constructor(
    private http$ : HttpClient
  ) { }
  
  public getWishlist ( receiver : Person) : Observable<Wish[]>{
    let wishes: Wish[] = [];
    return this.http$.get<IWishlistResponse[]>(environment.apiUrl + 'wishlist/' + receiver.id).pipe(
      map( (response) => {
        response[0].wishes.forEach((wish) => {
          wishes.push(new Wish(
            wish._id,
            wish.title,
            wish.price,
            null,
            wish.url
          ));
        });
        return wishes;
      }),
      switchMap( (wishes) => {
        let wishStateObservables = wishes.map(wish => this.http$.get<wishStatus>(environment.apiUrl + 'wish/' + wish.id + '/state').pipe(catchError(() => of(null))));
        return forkJoin(wishStateObservables)
      }),
      map( states => {
        states.forEach((state, index) => {
          wishes[index].status = state;
        });
        return wishes;
      })      
    );

  }
}

/* tap( (wishes) => {
        let wishStateObservables = wishes.map(wish => this.http$.get<wishStatus>(environment.apiUrl + 'wish/' + wish.id + '/state').pipe(catchError(() => of(null))));
        forkJoin(wishStateObservables)
          .pipe(
            map(states => {
              states.forEach((state, index) => {
                wishes[index].status = state;
              });
              return wishes;
            })
          ).subscribe((wishes => { console.log(wishes) }));
      }) */