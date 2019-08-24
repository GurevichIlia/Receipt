import { GlobalData } from 'src/app/models/globalData.model';

import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { LastSelection } from '../../models/lastSelection.model';
import { CreditCardVerify } from '../../models/credirCardVerify.model';
import { AuthenticationService } from './authentication.service';
import { NewReceipt } from '../../models/newReceipt.model';
import { Guid } from 'guid-typescript';
import { ReceiptsService } from './receipts.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { CustomerInfoById } from '../../models/customer-info-by-ID.model';
import { Creditcard } from 'src/app/models/creditCard.model';



@Injectable({
  providedIn:'root'
})

export class GeneralSrv {
  id: Guid;
  userGuid: string;
  baseUrl: string;
  // fullReceiptDataFromServer = <any>{};
  fullReceiptData = new BehaviorSubject<GlobalData | ''>('');
  currentReceiptData$ = this.fullReceiptData.asObservable();
  position;
  language = new BehaviorSubject('he');
  currentLang$ = this.language.asObservable();
  orgName = localStorage.getItem('OrgName');
  httpOptions;

  sizeOfWindow = new Subject();
  currentSizeOfWindow = this.sizeOfWindow.asObservable();

  _lastSelection: LastSelection = <LastSelection>{};
  lastSelect = new BehaviorSubject<LastSelection>(this._lastSelection);
  /** *  Show which options customer selected at the last time */
  currentLastSelect$ = this.lastSelect.asObservable();

  orgNameSubj = new BehaviorSubject<string>(this.orgName);
  /**  *  Show the current organisation name after login*/
  currentOrgName$ = this.orgNameSubj.asObservable();

  partOfApplication = new BehaviorSubject('');
  currentPartOfApplication$ = this.partOfApplication.asObservable();
  constructor(private http: HttpClient,
    private authen: AuthenticationService,
    private zone: NgZone,
    private receiptService: ReceiptsService,
    private translate: TranslateService,
  ) {
    console.log('GENERAL SERVICE')
    this.switchLanguage('he');
    console.log('ORG NAME', this.orgName);
    this.userGuid = localStorage.getItem('userGuid');
    console.log('this.userGuid', this.userGuid)
    this.currentLang$.subscribe(lang => {
      this.zone.runOutsideAngular(() => {
        // setInterval(() => {
        if (lang === 'he') {
          this.position = {
            'text-right': true,
          };
        } else {
          this.position = {
            'text-left': true,
          };
        }
        // }, 1);
      });
    });
    this.baseUrl = 'https://jaffawebapisandbox.amax.co.il/API/'; // serviceConfig.serviceApiUrl;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authen.tokenNo
      })
    };
    this.getWindowWidth();
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.language.next(language);
    if (language === 'he') {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.setAttribute('dir', 'ltr');
    }
  }

  /**
     *  Get all customers
     */
  public getUsers(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authen.tokenNo
      })
    };
    return this.http.get<any>(`${this.baseUrl}Receipt/GetCustomerSearchData?urlAddr=${this.orgName}`,
      httpOptions)
      .pipe(map(response => response.Data));
  }
  /***  Get customer bt customerId */
  getCustomerInfoById(customerId: number): Observable<CustomerInfoById> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authen.tokenNo
      })
    };
    return this.http.get<any>(`${this.baseUrl}Receipt/GetCustomerDataByCustomerID?urlAddr=${this.orgName}&customerid=${customerId}`, httpOptions)
      .pipe(
        map(response => response.Data),
        map(data => {
          data.GetCustomerReciepts_CameFrom.map(data => {
            data.ValueDate = this.changeDateFormat(data.ValueDate, 'YYYY-MM-DD');
            data.RecieptDate = this.changeDateFormat(data.RecieptDate, 'YYYY-MM-DD');
          })
          data.GetCustomerReciepts.map(data => {
            data.ValueDate = this.changeDateFormat(data.ValueDate, 'YYYY-MM-DD');
            data.RecieptDate = this.changeDateFormat(data.RecieptDate, 'YYYY-MM-DD');
          })
          data.GetCustomerReciepts_Involved.map(data => {
            data.ValueDate = this.changeDateFormat(data.ValueDate, 'YYYY-MM-DD');
            data.RecieptDate = this.changeDateFormat(data.RecieptDate, 'YYYY-MM-DD');
          })
          return data;
        }));
  }
  /**
   *  Get receipts data
   */
  getReceiptshData() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authen.tokenNo
      })
    };
    return this.http.get<any>(`${this.baseUrl}Receipt/GetReceiptshData?urlAddr=${this.orgName}`, httpOptions)
      .pipe(map(response => response.Data),
      );
  }
  /**
   *  Get all products
   */
  getProductsData() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authen.tokenNo
      })
    };
    return this.http.get<any>(`${this.baseUrl}Receipt/GetProductsData?urlAddr=${this.orgName}`, httpOptions)
      .pipe(map(response => response.Data)
      );
  }
  creditCardVerify(creditCard: Creditcard) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authen.tokenNo
      })
    };
    return this.http.post(`${this.baseUrl}Receipt/ChargeAshraiVerify?urlAddr=${this.orgName}`, creditCard, httpOptions);
  }

  public validateLogin(
    url: string,
    UserID: string,
    Password: string,
    OrganizationName: string
  ): Observable<any> {
    let apiUrl =
      this.baseUrl + 'LandingPage/LoginToSystem?guid=' + OrganizationName;

    // const headers = new HttpHeaders();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    // headers.append("Accept", "application/json");

    let userInfo = {
      OrgId: OrganizationName,
      UserName: UserID,
      Password: Password
    };
    let params = JSON.stringify(userInfo);
    const obs = this.http.post(apiUrl, params, httpOptions);
    // obs.subscribe(response => console.log(response));

    return obs;
  }

  public CallTestAfterLOgin(): Observable<any> {
    let apiUrl = `${this.baseUrl}'LandingPage/AfterLoginToSystem?urlAddr='${this.orgName}`;

    // const headers = new HttpHeaders();
    // console.log(this.authen.getToken());

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authen.tokenNo
      })
    };

    let OrganizationName;

    let userInfo = {
      OrgId: OrganizationName
    };
    let params = JSON.stringify(userInfo);
    const obs = this.http.post(apiUrl, params, httpOptions);
    // obs.subscribe(response => console.log(response));

    return obs;
  }

  public GetSystemTables(): Observable<any> {
    let apiUrl = `${this.baseUrl}LandingPage/GetSytemTablesData?urlAddr=${this.orgName}`;

    // const headers = new HttpHeaders();
    // console.log(this.authen.getToken());

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authen.tokenNo
      })
    };

    let OrganizationName;

    let userInfo = {
      OrgId: OrganizationName
    };
    let params = JSON.stringify(userInfo);
    const obs = this.http.get(apiUrl, httpOptions)
      .pipe(map(response => response['Data']));

    // obs.subscribe(response => {
    //   const cities = response.Cities;
    //   console.log(cities)

    // })
    return obs;
  }

  public GetCustomerSearchData(): Observable<any> {
    let apiUrl = `${this.baseUrl}'Receipt/GetCustomerSearchData?urlAddr='${this.orgName}`;

    // const headers = new HttpHeaders();
    // console.log(this.authen.getToken());

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authen.tokenNo
      })
    };

    //  debugger;

    let OrganizationName;

    let userInfo = {
      OrgId: OrganizationName
    };
    let params = JSON.stringify(userInfo);
    const obs = this.http.get<any>(apiUrl, httpOptions);
    // obs.subscribe(response => console.log(response));
    return obs;
  }
  /**
   * Handle any errors from the API
   */
  private handleError(err) {
    let errMessage: string;
    if (err instanceof Response) {
      let body = err.json() || '';
      let error = body['error'] || JSON.stringify(body);
      errMessage = `${err.status} - ${err.statusText} || ''} ${error}`;
    } else {
      errMessage = err.message ? err.message : err.toString();
    }
    return Observable.throw(errMessage);
  }
  changePositionElement() {
    return this.position;
  }
  sendFullReceiptToServer(receipt: NewReceipt) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authen.tokenNo
      })
    };
    return this.http.post(`${this.baseUrl}Receipt/SaveReceiptInfo?urlAddr=${this.orgName}`, receipt, httpOptions);
  }
  setOrgName(orgName: string, employeeId: string) {
    this.orgName = orgName;
    localStorage.setItem('OrgName', this.orgName);
    this.createGuidForLocalStorage(orgName, employeeId);
  }
  createGuidForLocalStorage(orgName: string, employeeId: string) {
    // this.id = Guid.create();
    this.userGuid = `${orgName}_${employeeId}`.toString();
    // console.log('ID', this.id.toString())
    localStorage.setItem('userGuid', this.userGuid);
    console.log('GUID', this.userGuid.toString());
  }
  getItemsFromLocalStorage(item) {
    if (localStorage.getItem(item)) {
      return +localStorage.getItem(item);
    } else {
      return '';
    }
  }
  getUserGuid() {
    return this.userGuid;
  }
  get lastSelection() {
    return this._lastSelection;
  }
  set lastSelection(value: any) {
    this._lastSelection = value;
  }
  saveLastSelection() {
    const lastSelection = this.lastSelection;
    const key = this.getUserGuid();

    localStorage.setItem(key, JSON.stringify(lastSelection));
    this.lastSelection = <LastSelection>{};
    console.log('LAS SELECT clear', this.lastSelection);
  }
  setItemToLastSelection(key: string, value: any) {
    this.lastSelection[key] = value;
    console.log(this.lastSelection);
  }
  getLastSelectionFromLocalStore() {
    this.setItemToLastSelection('selected_receiptCreditOrDebit', false);
    const userGuit = this.getUserGuid();
    const lastSelection: LastSelection = JSON.parse(localStorage.getItem(userGuit));
    if (lastSelection === null || lastSelection === undefined) {
      this._lastSelection = {
        accountId: null,
        associationId: null,
        creditCardAccId: null,
        paymentFor: null,
        paymenthMethodId: null,
        project: null,
        projectCategory: null,
        receiptTypeId: null,
        receiptFor: '',
        receiptTemplate: null,
        selectedOrg: 1,
        selected_receiptCreditOrDebit: false,
        selected_receiptIsForDonation: true
      }
      console.log('LAS SELECT clear', this.lastSelection);
    } else {
      this.lastSelection = lastSelection;
    }
    this.lastSelect.next(this.lastSelection);
    console.log('LAS SELECT', this.lastSelection);
  }
  getWindowWidth() {
    this.sizeOfWindow.next(window.innerWidth);
  }
  checkLocalStorage(itemName: string) {
    return localStorage.getItem(itemName);
  }
  changeDateFormat(date: string, format: string) {
    return moment(date).format(format);
  }
  getOrgName() {
    return this.orgName;
  }
}
