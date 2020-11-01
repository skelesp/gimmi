import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetTokenResolver implements Resolve<boolean> {

  constructor( private userService : UserService ) { }
  
  resolve ( route : ActivatedRouteSnapshot, state: RouterStateSnapshot ) : Observable<boolean> | boolean {
    return this.userService.validatePasswordResetToken(route.paramMap.get('token')).pipe(
      catchError(() => { return of(false)}),
      map(token => { return token ? true : false;})
    ); 
  }

}
