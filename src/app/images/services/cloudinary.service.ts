import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICloudinaryImage } from 'src/app/wishes/models/wish.model';
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
   * Rename a cloudinary image
   * @function renameImage
   * @param {String} publicId The current publicId of the image
   * @param {String} newName The new name of the image. No foldername included in this id!! Only new image ID.
   * @return {Image}
   */
  public renameImage (publicId, newName) : Observable<ICloudinaryImage> {
    return this.http$.put<any>(
      environment.apiUrl + 'images/' + encodeURIComponent(publicId) + '/public_id',
      { new_public_id: newName }
    ).pipe(
      map(renamedImage => ({publicId: renamedImage.public_id, version: renamedImage.version}))
    )
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
