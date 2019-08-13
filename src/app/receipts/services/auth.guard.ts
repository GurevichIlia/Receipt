import { Router } from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthenticationService } from './authentication.service';

import { Store } from '@ngrx/store';
import * as fromApp from '../../app.reducer'
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  currentAuthStatus: boolean;
  subscription$ = new Subject();
  constructor(private authServices: AuthenticationService,
    private router: Router,
    private store: Store<{ auth: fromApp.State }>
  ) { }
  canActivate(): boolean {
    this.store.subscribe(status => {
      if (status.auth.isLogged) {
        this.currentAuthStatus = true;
      } else {
        this.router.navigate(['login']);
        this.currentAuthStatus = false;
      }
    });

    return this.currentAuthStatus;
  }

}
