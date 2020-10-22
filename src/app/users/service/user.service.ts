import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { IDecodedToken, User } from '../models/user.model';

export interface ILocalLoginInfo {
  email: string,
  password: string
}

export interface IAuthResponse {
  message: string;
  success: boolean;
  token: string;
}

type logoutReason = "USER_EVENT" | "EXPIRED_TOKEN" | "FAILED_AUTHENTICATION" | "401_RESPONSE";

// Don't inject via constructor: https://stackoverflow.com/questions/49739277/nullinjectorerror-no-provider-for-jwthelperservice
// See code example for standalone implementation: https://www.npmjs.com/package/@auth0/angular-jwt
const jwtService = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser$: Observable<User>;
  public attemptedUrl: string;

  constructor( 
    private http$: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) { 
    this.currentUserSubject = new BehaviorSubject<User>(this.getUserFromStoredToken());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUser() : User {
    return this.currentUserSubject.value;
  }

  public authenticate (authInfo: ILocalLoginInfo ) : Observable<User> {
    return this.http$.post<IAuthResponse>(environment.apiUrl + 'authenticate', {...authInfo, account: 'local'})
      .pipe(
        catchError(this.handleAErrorResponse),
        tap( authResponse => {
          this.persistentlySaveUserToken(authResponse.token);
          this.setUser(this.getUserFromStoredToken());
        }),
        map ( () => { return this.currentUser})
      )
  }
  
  public logout(reason : logoutReason) : void {
    // Log logout info
    let logMessage = `User logged out.`;
    if (reason) { logMessage += ` Reason : ${reason}` }
    console.info(logMessage);

    //Remove user
    localStorage.removeItem("currentUser");
    this.currentUserSubject?.next(null); // On init of this service, currentUserSubject isn't created when logout is called for expired token.

    //Navigate to homepage
    location.reload(true);
  }
  
  public register(newUser : User) : void {
    this.currentUserSubject.next(newUser);
  }

  private setUser(user : User): void {
    this.currentUserSubject.next(user);
  }

  private persistentlySaveUserToken (token: string) : void {
    localStorage.setItem('currentUser', token);
  }

  private getUserFromStoredToken () : User {
    let token = localStorage.getItem('currentUser');
    if (!token) {
      console.info("[UserService] No token found in local storage");
      return null
    }

    if (jwtService.isTokenExpired(token)) {
      this.handleExpiredToken();
      return null;
    }
    
    let decodedToken: IDecodedToken = jwtService.decodeToken(token);
    console.info("[UserService] Valid token found")
    return new User(
      decodedToken.id,
      decodedToken.lastName,
      decodedToken.firstName,
      decodedToken.email,
      decodedToken.loginStrategy,
      token,
      decodedToken.accounts
    );
  }

  private handleExpiredToken () : void {
    // CurrentUserSubject doesn't exist when token is checked on page load ==> Check if CurrentUserSubject exists
    this.logout("EXPIRED_TOKEN");
    
    this.notificationService.showNotification(
      "Je sessie is verlopen. Gelieve opnieuw in te loggen.",
      "warning",
      "Uitgelogd");
    console.error("[UserService] Token is expired");
  }

  private handleAErrorResponse (errorResponse: HttpErrorResponse) {
    let errorMessage = 'Request ended with an error. Please try again.' + JSON.stringify(errorResponse);
    if (errorResponse.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = 'An error occurred:' + errorResponse.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage = `Gimmi API returned code ${errorResponse.status} with message "${errorResponse.error.message}"`;
    }
    // Return an observable with a user-facing error message.
    return throwError(errorMessage);
  }
}
