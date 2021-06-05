import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IWishImage } from 'src/app/wishes/models/wish.model';
import { environment } from 'src/environments/environment';

const widgetUrl = 'https://widget.cloudinary.com/v2.0/global/all.js';
@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private renderer : Renderer2;

  constructor( 
    private http$ : HttpClient,
    rendererFactory : RendererFactory2
  ) { 
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // create the upload widget and insert cloudinary script in html if it doesn't exist
  public createUploadWidget(data: any, callback: (error: any, result: any) => void): Observable<any> {
    return this.scriptExists(widgetUrl)
      // js is embeded -> call js function directly
      ? of((window as any).cloudinary.createUploadWidget(data, callback))
      // js isn't embeded -> embed js file and wait for it to load
      : fromEvent(this.addJsToElement(widgetUrl), 'load').pipe(
        // map to call of js function
        map(e => (window as any).cloudinary.createUploadWidget(data, callback))
      );
  }


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
  public renameImage (publicId : string, newName : string) : Observable<IWishImage> {
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
  public deleteImage ( image : IWishImage) : Observable<boolean>{
    if (image.publicId === environment.cloudinary.defaultImage.publicId) return of(false)

    return this.http$.delete<any>(
      environment.apiUrl + 'images/' + encodeURIComponent(image.publicId)
    ).pipe(
      map( result => result.delete === "ok"),
      catchError((error: HttpErrorResponse) => {
        console.error('[cloudinaryService] PublicID not found', error);
        return of(false);
      })
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

  public isTemporaryImage (image : IWishImage) {
    return image.publicId.slice(-environment.cloudinary.temporaryImagePostfix.length) === environment.cloudinary.temporaryImagePostfix;
  }

  /*******************
   * PRIVATE methods *
   *******************/

  // check if js file is already embeded
  private scriptExists(jsUrl: string): boolean {
    return document.querySelector(`script[src="${jsUrl}"]`) ? true : false;
  }

  // embed external js file in html
  private addJsToElement(jsUrl: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = jsUrl;
    this.renderer.appendChild(document.body, script);
    return script;
  }
}
