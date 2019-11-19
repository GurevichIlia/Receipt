import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/receipts/services/authentication.service';
import { take } from 'rxjs/operators';

@Injectable({
      providedIn: 'root'
})
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
            this.authService.currentlyAuthStatus$
                  .pipe(
                        take(1))
                  .subscribe(state => {
                        if (state) {
                              this.router.navigate(['/home']);
                              authStatus = false
                        } else
                              authStatus = true;
                  }, error => console.log(error))
            return authStatus;
      }
}
