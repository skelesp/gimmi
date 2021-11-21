import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface LeanStartupRespone {
  data: number[][];
  labels: string[];
  series: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor(
    private http$: HttpClient
  ) { }

  /**
  * @method @public
  * @description Get the data for the leanstartup report.
  */
  public getLeanStartupData(): Observable<LeanStartupRespone> {
    return this.http$.get<LeanStartupRespone>(
      environment.apiUrl + 'reporting/leanstartup'
    ).pipe(
      catchError(this.handleError)
    )
  }

  /** 
   * @method @private 
   * @description Handle errors in the people service HTTP calls
  */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Request ended with an error. Please try again.' + JSON.stringify(error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = 'An error occurred:' + error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage = `Gimmi API returned code ${error.status}. Error info: ${JSON.stringify(error.error)}`;
    }
    // Return an observable with a user-facing error message.
    console.error(errorMessage);
    return throwError(errorMessage);
  }

}
