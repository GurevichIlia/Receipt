import { Router } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthenticationService } from './authentication.service';


import { takeUntil, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  currentAuthStatus: boolean;
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }
  canActivate(): boolean {
    this.authService.currentlyAuthStatus$
      .pipe(take(1))
      .subscribe(status => {
        if (status) {
          this.currentAuthStatus = true;
        } else {
          this.router.navigate(['login']);
          this.currentAuthStatus = false;
        }
      }, error => console.log(error));
    return this.currentAuthStatus;
  }

}

