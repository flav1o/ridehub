import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDataService } from 'src/app/services/user-data.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() { }
  authToken : string = localStorage.getItem('userToken');

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${this.authToken}`),
    })

    return next.handle(request);
  }
}

export const AuthInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
}
