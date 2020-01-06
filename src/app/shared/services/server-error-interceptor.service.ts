import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { retry, catchError, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { AuthenticationService } from './authentication.service';
import { ModalSessionexpiredComponent } from '../modals/modal-sessionexpired/modal-sessionexpired.component';

@Injectable({
  providedIn: 'root'
})
export class ServerErrorInterceptor implements HttpInterceptor {
  getError = new Subject();
  constructor(
    private router: Router,
    private modal: MatDialog,
    private spinner: NgxUiLoaderService,
    private authService: AuthenticationService,

  ) {


  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(0),
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {


          this.getError.next();
          this.getError.complete();
          console.log(error);
          this.spinner.stop();
          // this.authService.logout()
          this.modal.open(ModalSessionexpiredComponent, { width: '450px' });
          return throwError(error);
        } else {
          console.log(error);
          this.spinner.stop();
          return throwError(error);

        }
      }),
      takeUntil(this.getError))
  }
}
