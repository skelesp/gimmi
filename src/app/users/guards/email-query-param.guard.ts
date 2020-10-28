import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, NavigationExtras } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PeopleService } from 'src/app/people/service/people.service';

@Injectable({
  providedIn: 'root'
})
export class EmailQueryParamGuard implements CanActivate {
  
  constructor(
    private _peopleService : PeopleService,
    private router : Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.has('e')) {
      let email = queryParams.get('e');
      let navigationExtras : NavigationExtras = {
        queryParams : { e: email}
      }
      return this._peopleService.findPersonByEmail(email).pipe(
        catchError( () => { return of(null) }),
        map( person => { 
          let personFound = !!person;
          // If known person navigates to register, it's more logical to redirect to login page to login with known email (and vice versa)
          if ( state.url.indexOf('users/register') !== -1 && personFound) {
            return this.router.createUrlTree(['users/login'], navigationExtras);
          } else if (state.url.indexOf('users/login') !== -1 && !personFound) {
            return this.router.createUrlTree(['users/register'], navigationExtras);
          } else {
            return true;
          }

        }),

      );
    }

    return true
  }
  
}

/* return this._peopleService.findPersonByEmail(control.value)
  .pipe(
    tap(value => this.knownPerson = value),
    map(personResult => { return { 'emailExists': true } }),
    catchError(error => { return of(null) })
  ); */