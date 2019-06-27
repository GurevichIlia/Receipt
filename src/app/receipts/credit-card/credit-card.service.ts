import { HttpClient } from '@angular/common/http';
import { Creditcard } from '../../models/creditCard.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {
  credCardIsVerified = new BehaviorSubject(false);
  currentCreditCardIsVerified$ = this.credCardIsVerified.asObservable();
  verifiedCreditCardDetails: Creditcard;
  url = 'https://secure.cardcom.solutions/Interface/Direct2.aspx?';
  constructor(
    private http: HttpClient
  ) { }

  get verifiedCredCard() {
    return this.verifiedCreditCardDetails;
  }
  setCredCardIsVerified(value: boolean) {
    this.credCardIsVerified.next(value);
  }
  getCreditCardInfoWithCardreader(terminalNumberMain: string, creditCardNumber: string, terminalNumberMainUser: string) {
// tslint:disable-next-line: max-line-length
    const txtXml = `${this.url}TerminalNumber=${terminalNumberMain}&cardchanle2=${creditCardNumber}&username=${terminalNumberMainUser}&jparameter=2&dealcode=0`;
    return this.http.get(txtXml, {responseType: 'text'});
  }
}
