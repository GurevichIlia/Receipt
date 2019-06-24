import { LastSelection } from './../models/lastSelection.model';
import { CreditCardVerify } from './../models/credirCardVerify.model';
import { Injectable, NgZone } from '@angular/core';
import { serviceConfig } from '../Myappconfig';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, Subscription } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { map } from 'rxjs/operators';
// import { Storage } from "@ionic/storage";
import { AuthenticationService } from '../services/authentication.service';
import { Receipt } from '../models/receipt.model';
import { NewReceipt } from '../models/newReceipt.model';
// import { AlertController } from "@ionic/angular";
import { Guid } from 'guid-typescript';
import { ReceiptsService } from './receipts.service';


@Injectable()
export class GeneralSrv {
  id: Guid;
  userGuid: string;
  baseUrl: string;
  fullReceiptDataFromServer: any[] = [];
  fullReceiptData = new BehaviorSubject(this.fullReceiptDataFromServer);
  receiptData = this.fullReceiptData.asObservable();
  position;
  language = new BehaviorSubject('he');
  currentlyLang$ = this.language.asObservable();
  orgName: string;
  httpOptions
  _lastSelection: LastSelection = <LastSelection>{};
  private subscribtions: Subscription = new Subscription();
  lastSelect = new BehaviorSubject(this._lastSelection);
  currentLastSelect = this.lastSelect.asObservable();

  constructor(private http: HttpClient,
    private authen: AuthenticationService,
    private zone: NgZone,
    private receiptService: ReceiptsService) {
    this.orgName = localStorage.getItem('OrgName');
    console.log('ORG NAME', this.orgName);
    this.userGuid = localStorage.getItem('userGuid');
    console.log('this.userGuid', this.userGuid)
    this.currentlyLang$.subscribe(lang => {
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
    this.baseUrl = 'https://jaffawebapi.amax.co.il/API/'; // serviceConfig.serviceApiUrl;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authen.tokenNo
      })
    };
  }

  // private getHeader(): Headers {
  //   var header = new Headers();
  //   header.append("Content-Type", "application/json; charset=utf-8");
  //   if (sessionStorage.getItem(serviceConfig.accesTokenStoreName)) {
  //     header.append(
  //       serviceConfig.accesTokenRequestHeader,
  //       sessionStorage.getItem(serviceConfig.accesTokenStoreName)
  //     );
  //   } else {
  //     throw "Access token not available";
  //   }
  //   return header;
  // }


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
  /**
   *  Get customer bt customerId
   */
  getCustomerInfoById(customerId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authen.tokenNo
      })
    };
    // tslint:disable-next-line: max-line-length
    return this.http.get<any>(`${this.baseUrl}Receipt/GetCustomerDataByCustomerID?urlAddr=${this.orgName}&customerid=${customerId}`, httpOptions)
      .pipe(map(response => response.Data));
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
  creditCardVerify(creditCard: CreditCardVerify) {
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

  public CallTestAfterLOgin(url: string): Observable<any> {
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

  public GetSystemTables(url: string): Observable<any> {
    let apiUrl = `${this.baseUrl}LandingPage/GetSytemTablesData?urlAddr=${url}`;

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

  public GetCustomerSearchData(url: string): Observable<any> {
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
}
