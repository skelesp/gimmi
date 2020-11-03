import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Person } from 'src/app/people/models/person.model';
import { environment } from 'src/environments/environment';
import { Wish } from '../models/wish.model';

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
    return this.http$.get<IWishlistResponse[]>(environment.apiUrl + 'wishlist/' + receiver.id).pipe(
      map( (response) => {
        let wishes: Wish[] = [];
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
      } )
    );
  }
}
