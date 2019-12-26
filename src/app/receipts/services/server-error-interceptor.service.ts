import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';

import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { retry, catchError, take, takeWhile, takeUntil, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { ModalSessionexpiredComponent } from '../modals/modal-sessionexpired/modal-sessionexpired.component';
import { AuthenticationService } from './authentication.service';

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
          this.authService.logout()
          this.modal.open(ModalSessionexpiredComponent, { width: '450px' });
          // this.router.navigate(['login']);
          this.getError.next();
          this.getError.complete();
          console.log(error);
          this.spinner.stop();
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
