import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Person, IPersonResponse, IPerson } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private people$ = new BehaviorSubject<Person[]>([]);

  constructor( private http$: HttpClient) { }

  getPeople () : Observable<IPerson[]>{
    return this.http$.get<IPersonResponse[]>('http://localhost:5000/api/people')
    .pipe(
      tap((responseData) => { console.log('response: ', responseData); }),
      map( peopleFromResponse => {
        let people: IPerson[] = [];
        peopleFromResponse.forEach(person => {
          delete person._id;
          people.push(person);
        });
        return people;
      })
    );
  }
}
