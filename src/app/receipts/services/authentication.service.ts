import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { ReceiptsService } from './receipts.service';
import { CreditCardService } from '../credit-card/credit-card.service';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../app.reducer'


const TOKEN_KEY = 'auth-token';

const TokenConfig = {
  tokenKey: TOKEN_KEY
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authenticationstate = new BehaviorSubject(false);
  currentlyAuthStatus$ = this.authenticationstate.asObservable();
  typeOfUser = new BehaviorSubject(null);
  currentTypeOfUser$ = this.typeOfUser.asObservable();
  public tokenNo = localStorage.getItem('id_token');

  constructor(
    private receiptService: ReceiptsService,
    private creditCardService: CreditCardService,
    private router: Router,
    private store: Store<{ auth: fromApp.State }>,
  ) {
    console.log('AUTH SERVICE LOADED');
    console.log('AUTH', this.isAuthenticated())

    this.store.subscribe(data => console.log('CURRENT AUTH STATUS', data.auth.isLogged))
    if (localStorage.getItem('id_token')) {
      // this.authenticationstate.next(true);
      this.store.dispatch({ type: 'IS_LOGGED' });

    } else {
      // this.authenticationstate.next(false);
      this.store.dispatch({ type: 'NO_LOGGED' });

    }
    if (localStorage.getItem('typeOfUser')) {
      this.typeOfUser.next(+localStorage.getItem('typeOfUser'));
    }
  }

  login(responseData) {
    this.tokenNo = responseData.token;
    this.setSession(responseData.token);
    // this.authenticationstate.next(true);
    this.store.dispatch({ type: 'IS_LOGGED' });

  }

  isAuthenticated() {
    // check memory
    this.authenticationstate.next(this.isLoggedIn());
    return this.authenticationstate.value;
  }

  // checkToken() {
  //   //shlomo call also to valoidate the token in the server
  //   this.authenticationstate.next(true);
  // }

  // getToken() {}

  private setSession(authResult) {
    // const expiresAt = moment().add(authResult, 'second');
    const expiresAt = jwt_decode(authResult);

    console.log("EXPIRE AS", expiresAt)
    //  alert(3);

    localStorage.setItem('id_token', authResult);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.exp.valueOf()));
  }
  logout() {
    //  alert(2);
    sessionStorage.clear();
    this.refreshFullState();
    this.router.navigate(['login']);
  }
  isLoggedIn() {
    //  alert(1);
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    // alert(4);
    return !this.isLoggedIn();
  }

  getExpiration() {
    //  alert(5);
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = expiration;
    console.log('GetExpiration', expiresAt);
    return expiresAt;
  }
  refreshFullState() {
    localStorage.removeItem('cities');
    localStorage.removeItem('customerSearchData');
    localStorage.removeItem('generalGroups');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.receiptService.setStep(1);
    // this.authenticationstate.next(false);
    this.store.dispatch({ type: 'NO_LOGGED' });
    this.receiptService.amount.next(null);
    this.creditCardService.credCardIsVerified.next(false);
    this.receiptService.createNewEvent.next();
  }
}

export { TokenConfig };
