import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor( private userService: UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.userService.token;
    if (token) {
      request = request.clone({ 
        setHeaders: { Authorization: `${token}` } 
      });
    }
    
    return next.handle(request);
  }
}
