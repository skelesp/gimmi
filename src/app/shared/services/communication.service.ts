import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor( private http$: HttpClient ) { }

  public sendMail (mail) {
    var mailInfo = { // Create mail info type
      to: mail.to,
      subject: mail.subject,
      html: mail.html
    };

    return this.http$.post<string>(environment.apiUrl + 'email', mailInfo).subscribe((result: string) => {
      console.info('Mail sent:' + result);
    }, (error: HttpErrorResponse) => {
      console.error(error);
    });
  }
}
