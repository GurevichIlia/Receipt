import { Injectable } from '@angular/core';
import { serviceConfig } from '../Myappconfig';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { map } from 'rxjs/operators';
// import { Storage } from "@ionic/storage";
import { AuthenticationService } from '../services/authentication.service';
// import { AlertController } from "@ionic/angular";

@Injectable()
export class GeneralSrv {
  baseUrl: string;
  fullReceiptDataFromServer: any[] = [];
  fullReceiptData = new BehaviorSubject(this.fullReceiptDataFromServer);
  receiptData = this.fullReceiptData.asObservable();
  constructor(private http: HttpClient, public authen: AuthenticationService) {
    // debugger;
    this.baseUrl = 'https://jaffawebapisandbox.amax.co.il/API/'; // serviceConfig.serviceApiUrl;
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
    return this.http.get<any>(`${this.baseUrl}Receipt/GetCustomerSearchData?urlAddr=amaxamax`)
      .pipe(map(response => response.Data));
  }
  /**
   *  Get customer bt customerId
   */
  getCustomerInfoById(customerId: number) {
    return this.http.get<any>(`${this.baseUrl}Receipt/GetCustomerDataByCustomerID?urlAddr=amaxamax&customerid=${customerId}`)
      .pipe(map(response => response.Data));
  }
  /**
   *  Get receipts data
   */
  getReceiptshData() {
    return this.http.get<any>(`${this.baseUrl}Receipt/GetReceiptshData?urlAddr=jaffanet1`)
      .pipe(map(response => response.Data));
  }
  /**
   *  Get all products
   */
  getProductsData() {
    return this.http.get<any>(`${this.baseUrl}Receipt/GetProductsData?urlAddr=amaxamax`)
      .pipe(map(response => response.Data),
        catchError(this.handleError)
      )
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
    let apiUrl = this.baseUrl + 'LandingPage/AfterLoginToSystem?urlAddr=' + url;

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
    let apiUrl = this.baseUrl + 'LandingPage/GetSytemTablesData?urlAddr=' + url;

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

    obs.subscribe(response => {
      const cities = response.Cities;
      console.log(cities)

    })
    return obs;
  }

  public GetCustomerSearchData(url: string): Observable<any> {
    debugger;
    let apiUrl = this.baseUrl + 'Receipt/GetCustomerSearchData?urlAddr=' + url;

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
}
