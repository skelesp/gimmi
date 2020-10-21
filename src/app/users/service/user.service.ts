import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';
import jwt_decode from "jwt-decode";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export interface IUser {
  id: string;
  name: string;
  firstName: string;
  loginStrategy: string;
  token?: string;
  accounts?: any
}

export interface ILocalLoginInfo {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser$: Observable<IUser>;

  constructor( 
    private http$ : HttpClient,
    private router: Router
    ) { 
    this.currentUserSubject = new BehaviorSubject<IUser>(this.getUserFromToken(this.token));
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUser() : IUser {
    return this.currentUserSubject.value;
  }

  public get token() : string {
    return localStorage.getItem('currentUser');
  }

  public authenticate (authInfo: ILocalLoginInfo ) : Observable<IUser> {
    return this.http$.post<IUser>(environment.apiUrl + 'authenticate', {...authInfo, account: 'local'})
      .pipe(
        catchError(this.handleAErrorResponse),
        tap( authResponse => this.persistentlySaveUserToken(authResponse.token)),
        map( authResponse => this.getUserFromToken(authResponse.token)),
        tap( user => this.setUser(user))
      )
  }
  
  public logout() : void {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    this.router.navigate(['users/login']);
  }
  
  public register(newUser : IUser) : void {
    this.currentUserSubject.next(newUser);
  }

  /**
   * @description Sets the current user and stores it in local storage.
   * @param user 
   */
  private setUser(user : IUser): void {
    this.currentUserSubject.next(user);
  }

  private persistentlySaveUserToken (token: string) : void {
    localStorage.setItem('currentUser', token);
  }

  private getUserFromToken (token: string) : IUser {
    try {
      let user = jwt_decode(token);
      user.token = token;
      return user;
    } catch (Error) {
      return null;
    }
  }

  private handleAErrorResponse (errorResponse: HttpErrorResponse) {
    let errorMessage = 'Request ended with an error. Please try again.' + JSON.stringify(errorResponse);
    if (errorResponse.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = 'An error occurred:' + errorResponse.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage = `Gimmi API returned code ${errorResponse.status}, ` +
        `body was: ${JSON.stringify(errorResponse.error)}`;
    }
    // Return an observable with a user-facing error message.
    return throwError(errorMessage);
    }
  }
