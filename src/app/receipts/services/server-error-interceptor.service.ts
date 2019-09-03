import { ModalSessionexpiredComponent } from '../modals/modal-sessionexpired/modal-sessionexpired.component';
import { AuthenticationService } from 'src/app/receipts/services/authentication.service';
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router,
    private authService: AuthenticationService,
    private modal: MatDialog
  ) {

  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(0),
      catchError((error: HttpErrorResponse) => {
      
        if (error.status === 401) {
          this.authService.logout();
          this.modal.open(ModalSessionexpiredComponent, { width: '450px' });
          this.router.navigate(['login']);
        } else {
          console.log(error);
          return throwError(error);
        }
      })
    );
  }
}
