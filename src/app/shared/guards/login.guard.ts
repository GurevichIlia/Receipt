import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable(
      {
      providedIn: 'root'
}
)
export class LoginGuard implements CanActivate {
      constructor(
            private authService: AuthenticationService,
            private router: Router,
      ) {

      }
      canActivate(
            next: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
            let authStatus: boolean;
            this.authService.currentlyAuthStatus$.subscribe(status => console.log('STATUS AUTH LOGIN GUARD', status))
            if (this.authService.authenticationstate.getValue() && localStorage.getItem('id_token')) {
                  this.router.navigate(['home']);
                  authStatus = false
            } else
                  authStatus = true;

            return authStatus;
      }
}
