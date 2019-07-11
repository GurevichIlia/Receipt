import { AuthenticationService } from 'src/app/services/authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
      providedIn: 'root'
})
export class LoginGuard implements CanActivate {
      constructor(
            private authService: AuthenticationService,
            private router: Router
      ) {

      }
      canActivate(
            next: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
            if (this.authService.authenticationstate.value) {
                  this.router.navigate(['/new-receipt']);
                  return false
            } else
                  return true;
      }
}
