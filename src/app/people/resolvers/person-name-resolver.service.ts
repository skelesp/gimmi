import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Person } from '../models/person.model';
import { PeopleService } from '../service/people.service';

@Injectable({
  providedIn: 'root'
})
export class PersonNameResolver implements Resolve<Person>{

  constructor(
    private peopleService : PeopleService
  ) { }

  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<Person> {
    return this.peopleService.getNameById(route.paramMap.get('personId'))
      .pipe(
        catchError( () => { return of(null); })
      );
  }
}
