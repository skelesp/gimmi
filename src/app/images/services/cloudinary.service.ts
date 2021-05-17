import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
   * Rename a cloudinary imagee
   * @function renameImage
   * @param {String} publicId The current publicId of the image
   * @param {String} newName The new name of the image. No foldername included in this id!! Only new image ID.
   * @return {Image}
   */
  public renameImage (publicId : string, newName : string) : Observable<ICloudinaryImage> {
    return this.http$.put<any>(
      environment.apiUrl + 'images/' + encodeURIComponent(publicId) + '/public_id',
      { new_public_id: newName }
    ).pipe(
      map(renamedImage => ({publicId: renamedImage.public_id, version: renamedImage.version}))
    )
  }

  /**
   * Delete a cloudinary image
   * @function deleteImage
   * @param {String} publicId The current publicId of the image
   */
  public deleteImage ( publicId : string) : Observable<boolean>{
    if (publicId === environment.cloudinary.defaultImage.publicId) return of(false)

    return this.http$.delete<any>(
      environment.apiUrl + 'images/' + encodeURIComponent(publicId)
    ).pipe(
      map( result => result.delete === "ok")
    );
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

  public isTemporaryImage (image : ICloudinaryImage) {
    return image.publicId.slice(-environment.cloudinary.temporaryImagePostfix.length) === environment.cloudinary.temporaryImagePostfix;
  }
}
