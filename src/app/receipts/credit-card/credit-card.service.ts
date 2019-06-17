import { Creditcard } from './../../models/creditCard.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  credCardIsVerified = new BehaviorSubject(false);
  currentlyCreditCardVarified = this.credCardIsVerified.asObservable();
  verifiedCreditCardDetails: Creditcard;
  constructor() { }

  get verifiedCredCard() {
    return this.verifiedCreditCardDetails;
  }

  setCredCardIsVerified(value: boolean) {
    this.credCardIsVerified.next(value);
  }
  
}
