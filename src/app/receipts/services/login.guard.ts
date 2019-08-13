import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/receipts/services/authentication.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../app.reducer'

@Injectable({
      providedIn: 'root'
})
export class LoginGuard implements CanActivate {
      constructor(
            private authService: AuthenticationService,
            private router: Router,
            private store: Store<{ auth: fromApp.State }>
      ) {

      }
      canActivate(
            next: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
            let authStatus: boolean;
            this.store.subscribe(state => {
                  if (state.auth.isLogged) {
                        this.router.navigate(['/home']);
                        authStatus = false
                  } else
                        authStatus = true;
            })
            return authStatus;
      }
}
