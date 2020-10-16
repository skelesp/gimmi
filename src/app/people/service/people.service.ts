import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { IPersonSearchResponse, IPerson } from '../models/person.model';
import { CommunicationService } from 'src/app/shared/services/communication.service';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private _people$ : BehaviorSubject<IPerson[]> = new BehaviorSubject<IPerson[]>([]);
  public readonly people: Observable<IPerson[]> = this._people$.asObservable();

  constructor( 
    private http$: HttpClient,
    private communicationService: CommunicationService ) { }

  /**
   * @method @public
   * @description Request the full list of people from the server. No filter applied! Puts result in private people observable.
   */
  retrievePeopleList () : void {
    this.http$.get<IPersonSearchResponse[]>(environment.apiUrl + 'people')
    .pipe(
      map( peopleFromResponse => {
        let people: IPerson[] = [];
        peopleFromResponse.forEach(person => {
          people.push(this.convertPersonResponseToPerson(person));
        });
        return people;
      }),
      catchError( error => {
        return throwError(error);
      })
    )
    .subscribe( people => {
      this._people$.next(people);
    });
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

  /**
   * @method @public
   * @description Invite someone to register in Gimmi and create a wishlist.
   * @param mailInfo The info necessary to send an email (to, cc, subject, body, ...)
   */
  public invite (email) {
    this.communicationService.sendMail({
      to: email,
      subject: "[DEV@GIMMI] Iemand vraagt je om een wensenlijst aan te maken op Gimmi",
      html: `Beste,<br/>
      <br/>
      Mensen zijn op zoek naar een cadeau voor jou en vragen je om een wensenlijst op te maken, zodat ze het perfecte cadeau kunnen komen.<br/>
      <br/>
      Ga snel naar <a href="${environment.rootSiteUrl}/users/register?e=${email}">de registratiepagina van gimmi.be</a> om je te registreren en je wensenlijst op te maken! Zo krijg je vanaf nu enkel nog cadeaus die je écht wilt hebben!<br/>
      <br/>      
      Hopelijk tot snel, <br/>
      <strong>Gimmi.be</strong>`
    });
  }
}
