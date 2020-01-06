import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';



import { MatDialog } from '@angular/material';
import { ModalSessionexpiredComponent } from '../modals/modal-sessionexpired/modal-sessionexpired.component';
import { AuthenticationService } from '../services/authentication.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthGuard implements CanActivate {
  currentAuthStatus: boolean;
  constructor(
    private router: Router,
    private modal: MatDialog,
    private authService: AuthenticationService
  ) { }
  canActivate(): boolean {
    console.log('AUTH SERV IN AUTH GUARD', this.authService)
    if (localStorage.getItem('id_token')) {
      this.currentAuthStatus = true;
    } else {
      this.modal.open(ModalSessionexpiredComponent, { width: '450px' });
      // this.authService.logout()
      this.currentAuthStatus = false;
    }

    return this.currentAuthStatus;
  }

}

