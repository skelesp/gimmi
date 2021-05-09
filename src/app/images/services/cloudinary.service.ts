import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  constructor( private http$ : HttpClient) { }

  public getSignature (callback, params_to_sign) {
    this.http$.post<any>(
      environment.apiUrl + 'images/signature',
      params_to_sign
    ).subscribe( result => {
      console.log(result);
      callback(result);
    });
  }
}
