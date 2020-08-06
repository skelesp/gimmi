import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { IPersonSearchResponse, IPerson } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private _people$ : BehaviorSubject<IPerson[]> = new BehaviorSubject<IPerson[]>([]);
  public readonly people: Observable<IPerson[]> = this._people$.asObservable();

  constructor( private http$: HttpClient) { }

  /**
   * @method @public
   * @description Request the full list of people from the server. No filter applied!
   * @returns An observable with an object of type IPersonSearchResponse.
   */
  retrievePeopleList () : Observable<IPerson[]>{
    return this.http$.get<IPersonSearchResponse[]>('http://localhost:5000/api/people')
    .pipe(
      map( peopleFromResponse => {
        let people: IPerson[] = [];
        peopleFromResponse.forEach(person => {
          people.push(this.convertPersonResponseToPerson(person));
          this._people$.next(people);
        });
        return people;
      })
    );
  }

  /**  
   * @method @private
   * @description Converts the person object received from the server to the person object used in the app. 
   * @param personResponse The person object received from the server
   * @returns A person object that is usable in the app
   */
  private convertPersonResponseToPerson (personResponse : IPersonSearchResponse) : IPerson {
    let convertedPerson = personResponse;
    delete convertedPerson._id;
    return convertedPerson;
  }
}
