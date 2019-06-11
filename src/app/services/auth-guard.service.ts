import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private authServices: AuthenticationService,
    private router: Router
  ) { }

  canActivate(): boolean {
    let currentluAuthStatus: boolean;
    if (localStorage.getItem('id_token')) {
      this.authServices.authenticationstate.next(true);
    } else {
      this.authServices.authenticationstate.next(false);
    }
    this.authServices.currentlyAuthStatus.subscribe(status => {
      if (status) {
        currentluAuthStatus = true;
      } else {
        this.router.navigate(['login']);
        currentluAuthStatus = false;
      }
    });
    return currentluAuthStatus;
  }

}
