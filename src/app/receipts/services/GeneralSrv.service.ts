
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map, switchMapTo, takeUntil, filter, startWith } from 'rxjs/operators';

import { LastSelection } from '../../models/lastSelection.model';
import { NewReceipt } from '../../models/newReceipt.model';
import { Guid } from 'guid-typescript';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { CustomerInfoById} from '../../models/customer-info-by-ID.model';
import { Creditcard } from 'src/app/models/creditCard.model';
import { FormArray, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';

import { GlobalData} from 'src/app/models/globalData.model';
import { Phones } from 'src/app/models/phones.model';
import { Emails } from 'src/app/models/emails.model';
import { Addresses } from 'src/app/models/addresses.model';
import { CustomerMainInfo } from 'src/app/models/customermaininfo.model';
import { GeneralGroups } from './../../models/generalGroups.model';
export interface CustomerSearchData {
  ActiveStatus: number;
  CustomerId: number;
  FileAs: string;
  FileAs1: string;
  SearchHide: boolean;
  TypeNameHeb: string;
  title: string;
}


@Injectable({
  providedIn: 'root'
})

export class GeneralSrv {
  id: Guid;
  userGuid: string;
  baseUrl: string;
  // fullReceiptDataFromServer = <any>{};

  position;
  language = new BehaviorSubject('he');
  currentLang$ = this.language.asObservable();
  orgName = localStorage.getItem('OrgName');;

  sizeOfWindow = new BehaviorSubject<number>(window.innerWidth);
  currentSizeOfWindow$ = this.sizeOfWindow.asObservable();

  _lastSelection: LastSelection = <LastSelection>{};
  lastSelect = new BehaviorSubject<LastSelection>(this._lastSelection);
  /** *  Show which options customer selected at the last time */
  currentLastSelect$ = this.lastSelect.asObservable();

  orgNameSubj = new BehaviorSubject<string>(this.orgName);
  /**  *  Show the current organisation name after login*/
  currentOrgName$ = this.orgNameSubj.asObservable();

  partOfApplication = new BehaviorSubject('');
  currentPartOfApplication$ = this.partOfApplication.asObservable();

  globalData = new BehaviorSubject<GlobalData>(null);
  /** Using this data in payments part of application */
  currentGlobalData$ = this.globalData.asObservable();


  subscription$ = new Subject();

  currentRoute: string;
  previousRoute: string;
  constructor(private http: HttpClient,
    private zone: NgZone,
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

    this.setWindowWidth();
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
     *  Get all customers for search
     */
  public getUsers(): Observable<CustomerSearchData[]> {
    return this.http.get<any>(`${this.baseUrl}Receipt/GetCustomerSearchData?urlAddr=${this.orgName}`,
    )
      .pipe(map(response => response.Data

      ));
  }

  /***  Get customer by customerId */
  getCustomerInfoById(customerId: number): Observable<CustomerInfoById> {
    // cons = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + this.authen.tokenNo
    //   })
    // };
    return this.http.get<any>(`${this.baseUrl}Receipt/GetCustomerDataByCustomerID?urlAddr=${this.orgName}&customerid=${customerId}`)
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
    // cons = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + this.authen.tokenNo
    //   })
    // };
    return this.http.get<any>(`${this.baseUrl}Receipt/GetReceiptshData?urlAddr=${this.orgName}`)
      .pipe(map(response => response.Data),
      );
  }
  /**
   *  Get all products
   */
  getProductsData() {
    // cons = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + this.authen.tokenNo
    //   })
    // };
    return this.http.get<any>(`${this.baseUrl}Receipt/GetProductsData?urlAddr=${this.orgName}`)
      .pipe(map(response => response.Data)
      );
  }
  creditCardVerify(creditCard: Creditcard) {
    // cons = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + this.authen.tokenNo
    //   })
    // };
    return this.http.post(`${this.baseUrl}Receipt/ChargeAshraiVerify?urlAddr=${this.orgName}`, creditCard);
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
    // cons = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'my-auth-token'
    //   })
    // };
    // headers.append("Accept", "application/json");

    let userInfo = {
      OrgId: OrganizationName,
      UserName: UserID,
      Password: Password
    };
    let params = JSON.stringify(userInfo);
    const obs = this.http.post(apiUrl, params);
    // obs.subscribe(response => console.log(response));

    return obs;
  }

  public CallTestAfterLOgin(): Observable<any> {
    let apiUrl = `${this.baseUrl}'LandingPage/AfterLoginToSystem?urlAddr='${this.orgName}`;


    let OrganizationName;

    let userInfo = {
      OrgId: OrganizationName
    };
    let params = JSON.stringify(userInfo);
    const obs = this.http.post(apiUrl, params);
    // obs.subscribe(response => console.log(response));

    return obs;
  }

  public GetSystemTables(): Observable<{ Cities: [], CustomerGroupsGeneral: GeneralGroups[] }> {

    let apiUrl = `${this.baseUrl}LandingPage/GetSytemTablesData?urlAddr=${this.orgName}`;


    let OrganizationName;

    let userInfo = {
      OrgId: OrganizationName
    };
    let params = JSON.stringify(userInfo);
    const obs = this.http.get(apiUrl)
      .pipe(map(response => response['Data']),
        map((data: { Cities: [], CustomerGroupsGeneral: GeneralGroups[] }) => {

          data.CustomerGroupsGeneral.map(group => {
            group.isSelected = false;
            const newGroup = { ...group }
            return newGroup;
          })
          return data;
        }));

    // obs.subscribe(response => {
    //   const cities = response.Cities;
    //   console.log(cities)

    // })
    return obs;
  }

  public GetCustomerSearchData(): Observable<any> {
    let apiUrl = `${this.baseUrl}'Receipt/GetCustomerSearchData?urlAddr='${this.orgName}`;

    let OrganizationName;

    let userInfo = {
      OrgId: OrganizationName
    };
    let params = JSON.stringify(userInfo);
    const obs = this.http.get<any>(apiUrl);
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
    // cons = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + this.authen.tokenNo
    //   })
    // };
    return this.http.post(`${this.baseUrl}Receipt/SaveReceiptInfo?urlAddr=${this.orgName}`, receipt);
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
  setWindowWidth() {
    this.sizeOfWindow.next(window.innerWidth);
  }

  checkLocalStorage(itemName: string) {
    return localStorage.getItem(itemName);
  }

  changeDateFormat(date: string, format: string) {
    if (date) {
      return moment(date).format(format);
    }

  }

  getOrgName() {
    return this.orgName;
  }

  getKevaGlbData(orgName: string): Observable<GlobalData> {
    console.log('GET GLOBAL KEVA REQUEST ')
    return this.http.get(`${this.baseUrl}keva/GetKevaGlbData?urlAddr=${orgName}`)
      .pipe(map(data => data = data['Data'])).pipe(takeUntil(this.subscription$));
  }

  setGlobalDataState(state: GlobalData) {
    console.log('GLOBAL DATA SET', state);
    this.globalData.next(state);
  }

  getGlobalDataState() {
    return this.globalData.getValue();
  }

  getGlobalData$() {
    if (this.getGlobalDataState()) {
      return this.currentGlobalData$;
    } else {
      return this.getKevaGlbData(this.getOrgName());
    }
  }

  formControlAutoComplete(filteredSubject: any[], titleInput: AbstractControl, filterKey: string) {
    if (filteredSubject) {
      let filteredOptions$;
      return filteredOptions$ = titleInput.valueChanges
        .pipe(
          startWith(''),
          map(value => this.filter(value, filteredSubject, filterKey))
        );
    }
  }
  private filter(value: string, filteredSubject: any[], filterKey: string) {

    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return filteredSubject.filter((title: any) => title[filterKey].toLowerCase().includes(filterValue))
  }

  patchInputValue(

    inputsArray: FormArray | FormGroup,
    valueArray: Phones[] | Emails[] | Addresses[] | CustomerMainInfo[],
    addNewInputFunction?: Function,
    formBuilder?: FormBuilder) {
    console.log('INPUTS ARRAY', inputsArray)
    let controlsKeys;
    if (valueArray) {
      if (valueArray.length > 0) {
        // если массив значений для инпутов не пустой, запуска. цикл для извлечения нужных значений.
        for (let i = 0; i < valueArray.length; i++) {
          if (inputsArray instanceof FormArray) {
            //создаю массив с названиями ключей на основании пришедшего FormArray.
            controlsKeys = Object.keys(inputsArray.controls[0]['controls']);
            // каждый ключ использую как имя при инизиализации импута и получаю в него значение по такому же ключу.
            controlsKeys.forEach((key: string) => {
              // изменяю стиль написания ключа, потому что в приходящих данных везде первая буква большая а название инпута в форме с маленькой, кроме fname и lname
              const arrKey = key
              //  (key === 'lname' || key === 'fname') ? key : key[0].toUpperCase() + key.substring(1);
              // обновляю массив FormArray c объектами в которых инпуты.
              inputsArray.controls[i].patchValue({
                [key]: valueArray[i][arrKey]
              })
            })
          } else if (inputsArray instanceof FormGroup) {
            //создаю массив с названиями ключей на основании пришедшего FormGroup.
            controlsKeys = Object.keys(inputsArray.controls);
            // каждый ключ использую как имя при инизиализации импута и получаю в него значение по такому же ключу.
            controlsKeys.forEach(key => {
              // изменяю стиль написания ключа, потому что в приходящих данных везде первая буква большая а название инпута в форме с маленькой, кроме fname и lname
              const arrKey = key;
              //  (key === 'lname' || key === 'fname') ? key : key[0].toUpperCase() + key.substring(1);
              // добавляю значения в объектe FormGroup с инпутами
              inputsArray.patchValue({
                [key]: valueArray[i][arrKey]
              })
            })
          }
          if (valueArray.length > i + 1) {
            // если в массиве значений для инпутов больше чем 1 объект, создаю еще один инпут.
            addNewInputFunction(inputsArray, formBuilder)
          } else {
            break;
          }
        }
      } else {
        if (inputsArray instanceof FormArray) {
          // если массив с значения для инпута пустой, дабвляю дефолтные значения(пустая строка).
          controlsKeys = Object.keys(inputsArray.controls[0]['controls']);
          controlsKeys.forEach(key => {
            inputsArray.controls[0].patchValue({
              [key]: ''
            })
          })
        } else if (inputsArray instanceof FormGroup) {
          controlsKeys = Object.keys(inputsArray.controls);
          controlsKeys.forEach(key => {
            inputsArray.patchValue({
              [key]: ''
            })
          })
        }

      }

    }
  }

  addPhoneInput(array: FormArray, fb: FormBuilder) {
    if (array.length < 10) {
      array.push(fb.group({
        phoneTypeId: [2],
        phoneNumber: ['']
      }));
    }

  }

  addEmailInput(array: FormArray, fb: FormBuilder) {
    if (array.length < 10) {
      array.push(fb.group({
        emailName: [''],
        email: [''],
      }));
    }
  }

  addAddressInput(array: FormArray, fb: FormBuilder) {
    if (array.length < 10) {
      array.push(fb.group({
        cityName: [''],
        street: [''],
        street2: [''],
        zip: [''],
        addressTypeId: [''],
        mainAddress: ['']
      }))
    }
  }

  getAddEmailFunction() {
    return this.addEmailInput;
  }

  getAddPhoneFunction() {
    return this.addPhoneInput;
  }

  getAddAddressFunction() {
    return this.addAddressInput;
  }

  setCurrentRoute(route: string) {
    this.currentRoute = route;
  }

  setPreviousRoute(route: string) {
    this.previousRoute = route;
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  getPreviousRoute() {
    return this.previousRoute;
  }
  // getCurrentAndPreviousRoutes() {
  //   this.currentRoute = this.router.url;
  //   this.router.events.subscribe(event => {
  //     if (event instanceof NavigationEnd) {
  //       this.previousRoute = this.currentRoute;
  //       this.currentRoute = event.url
  //       console.log('ROUTE EVENT', event);
  //     }

  //   })
  // }


}
