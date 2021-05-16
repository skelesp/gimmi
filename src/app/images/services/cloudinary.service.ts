import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  constructor( private http$ : HttpClient) { }

  /** Get a signature for a signed upload to Cloudinary */
  public getSignature (callback, params_to_sign) {
    this.http$.post<any>(
      environment.apiUrl + 'images/signature',
      params_to_sign
    ).subscribe( result => {
      callback(result);
    });
  }

  /**
   * Generate a random public id
   * @param {String} prefix A string to attach before the random number
   * @param {String} postfix A string to attach after the random number
   */
  public generateRandomPublicId (prefix, postfix) {
    var randomNumber : number = Math.floor((Math.random() * 1000000) + 1);
    return `${prefix}-${randomNumber}${postfix}`
  }
}
