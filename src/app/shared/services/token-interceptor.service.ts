import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private http: HttpClient) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newRequest: HttpRequest<any> = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        // token: localStorage.getItem('id_newstoken')

      }
    })

    return next.handle(newRequest);
  }

}

