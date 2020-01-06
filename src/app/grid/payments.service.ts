import { Response } from './../models/response.model';
import { CustomerInfoService } from './../shared/share-components/customer-info/customer-info.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable, throwError } from 'rxjs';

import { AuthenticationService } from '../shared/services/authentication.service';
import { GeneralSrv } from '../shared/services/GeneralSrv.service';

import { GlobalData } from './../models/globalData.model';
import { PaymentKeva } from '../models/paymentKeva.model';
import { CustomerCreditCard } from '../models/customerCreditCard.model';
import { KevaChargeById } from '../models/kevaChargeById.model';
import { UpdateKevaHistoryChargeStatus } from '../models/upadateKevaHistoryChargeStatus.model';
import { NewKevaFull } from '../models/newKevaFull';
import { KevaCharge } from './../models/kevaCharge.model';
import { NewPaymentService } from './grid-payments/new-payment/new-payment.service';

export interface KevaRemark {
  Id: number;
  Remark: string;
  RDate: string;
}

export interface KevaRemarkForUpdate {
  id: number;
  remark: string;
  deleterow: number;
  customerid: number
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  displayedColumns: { value: string, label: string }[] = [
    { value: 'Customerid', label: 'קוד כרטיס' },
    { value: 'Kevaid', label: 'מס הוראה' },
    { value: 'KEVANAME', label: 'שם החתום' },
    { value: 'BankCode', label: 'קוד בנק' },
    { value: 'SnifNo', label: 'מס סניף' },
    { value: 'AccountNo', label: 'מס חשבן' },
    { value: 'MountToCharge', label: 'סכום לחיוב' },
    { value: 'HokChargeDay', label: 'יום חיוב' },
    { value: 'TotalLeftToCharge', label: 'נותרו לחיוב' },
    { value: 'KEVAStart', label: 'מועד התחלה' },
    { value: 'KEVAEnd', label: 'שימוש פנימי\ סיום' },
    { value: 'GroupName', label: 'קבוצה' },
    { value: 'digits6', label: 'ספרות אחרונות' },
    { value: 'creditCardMonthAndYears', label: 'תוקף כרטיס' },
    { value: 'TotalMonthtoCharge', label: 'חודשים לחיוב' },
    { value: 'TotalChargedMonth', label: 'חודשים שחויבו' },
    { value: 'FileAs', label: 'שמ לקוח' },
    { value: 'CurrencyId', label: 'מטבע' },
    { value: 'empName', label: 'מגייס' },
    { value: 'KevaStatusIdname', label: 'מצב פעילות' },
    { value: 'ProjectName', label: ' פרוייקט' },
    { value: 'KEVAJoinDate', label: 'תאריך פתיחה' },
    { value: 'LastChargeDate', label: 'חיוב אחרון' },
    { value: 'KEVACancleDate', label: 'תאריך ביטול' },
    { value: 'ID', label: 'תז/חפ' },
    { value: 'Havur', label: 'עבור' },
    { value: 'AccName', label: 'לחשבון' },
    { value: 'NameOnTheReciept', label: 'שם לקבלה' },
    { value: 'Address', label: 'כתובת לקבלה' },
    { value: 'Phone1', label: 'טל 1' },
    { value: 'Phone2', label: 'טל 2' },
    // { value: 'NewSumToCharge', label: 'סכום חדש לחיוב' },
    // { value: 'NewSumAfterChargeNo', label: 'סכום חדש בעוד' },
    { value: 'RecieptTypeId', label: 'סוג קבלה' },
    // { value: 'cvv', label: 'cvv' },
    { value: 'LastReturnResonInfo', label: 'מצב שידור אחרון' },
    { value: 'TypeNameHeb', label: 'סוג כרטיס' },
    // { value: 'GetCreditTokefMonth', label: 'מוקף חודשום' },
    // { value: 'GetcreditCardTypeName', label: 'חברת אשראי' },
    { value: 'TadirutName', label: 'תדירות' },
    { value: 'RecieptName', label: 'קבלה להפקה' },
    { value: 'RecieptNameForRecord', label: 'קבלה לתעוד' },
    { value: 'createDate', label: 'תאריך יצירה' },
    // { value: 'ActiveStatus', label: 'מצב פעילות' },
    { value: 'KevaMakeRecieptByYear', label: 'הפקת קבלה' },
    { value: 'ThanksLetterName', label: 'תבנית הקבלה' },
  ]
  baseUrl = 'https://jaffawebapisandbox.amax.co.il/API/';
  httpOptions;
  subscription$ = new Subject<void>();

  paymentsTableData = new BehaviorSubject<PaymentKeva[]>([]);
  currentPaymentsTableData$ = this.paymentsTableData.asObservable();

  // globalData = new BehaviorSubject<GlobalData>(<GlobalData>{});
  // /** Using this data in payments part of application */
  // currentGlobalData$ = this.globalData.asObservable();

  filterValue = new Subject();
  currentFilterValue$ = this.filterValue.asObservable();

  filterValueByDay = new Subject();
  currentFilterValueByDay$ = this.filterValueByDay.asObservable();

  paymentTablePage = new BehaviorSubject<{ pageIndex: number, pageSize: number }>({ pageIndex: 0, pageSize: 10 })
  currentPaymentTablePage$ = this.paymentTablePage.asObservable();

  kevaChargesHistory = new BehaviorSubject<KevaCharge[]>([]);
  currentKevaChargesHistory = this.kevaChargesHistory.asObservable();

  listCustomerCreditCard: CustomerCreditCard[] = [];

  updateKevaTableClicked$ = new BehaviorSubject<boolean>(null);

  routeForComeBack = '' // Используем после удачного дублирования или редактирования или создания новой Кева, для возвращения на нужную страницу откуда мы начинали действия с Кева;
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private generalService: GeneralSrv,
    private customerInfoService: CustomerInfoService,
    // private customerDetails: CustomerDetailsService

  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.tokenNo
      }),
      responseType: 'json'
    };
    console.log('Service payment loaded');
    // this.getKevaGlbData(this.generalService.orgName);
  }


  getGridData(filterParams: { kevaTypeid: string, instituteid: string, KevaStatusid: string, KevaGroupid: string }): Observable<PaymentKeva[]> {
    return this.http.post(`${this.baseUrl}keva/GetKevaListData?urlAddr=${this.generalService.getOrgName()}`, filterParams, this.httpOptions)
      .pipe(
        map(data => data = data['Data']),
        map(data => {
          if (data) {
            data.map((data: PaymentKeva) => {
              // data.LastChargeDate = data.LastChargeDate === null ? '' : this.generalService.changeDateFormat(data.LastChargeDate, 'YYYY/MM/DD');
              // data.createDate = this.generalService.changeDateFormat(data.createDate, 'YYYY/MM/DD');
              data.creditCardMonthAndYears = this.concatMonthAndYear(data.creditCardMonth, data.creditCardYear); // create new pair key/value;
              // data.KEVACancleDate = this.generalService.changeDateFormat(data.KEVACancleDate, 'YYYY/MM/DD');
              // data.KEVAEnd = this.generalService.changeDateFormat(data.KEVAEnd, 'YYYY/MM/DD');
              // data.KEVAJoinDate = this.generalService.changeDateFormat(data.KEVAJoinDate, 'YYYY/MM/DD');
              // data.KEVAStart = this.generalService.changeDateFormat(data.KEVAStart, 'YYYY/MM/DD');
              return data;
            })
          } else {
            return data;
          }
          return data
        }
        ));
  }

  getKevaGlbData(orgName: string) {
    return this.http.get(`${this.baseUrl}keva/GetKevaGlbData?urlAddr=${orgName}`, this.httpOptions)
      .pipe(map(data => data = data['Data']));
  }

  getCustomersCreditCardListData(orgName: string) {
    return this.http.post(`${this.baseUrl}keva/GetCreditCardTokens?urlAddr=${orgName}`, '', this.httpOptions)
      .pipe(map(data => data = data['Data']), catchError(this.handleError));
  }

  getKevaCharges(orgName: string, instituteId: { instituteid: number }) {
    return this.http.post(`${this.baseUrl}keva/GetKevaCharges?urlAddr=${orgName}`, instituteId, this.httpOptions)
      .pipe(map(data => data = data['Data']), catchError(this.handleError));
  }

  getKevaChargesByChargeId(orgName: string, KevaChargeId?: string, customerid?: string): Observable<KevaChargeById[]> {
    const params = { KevaChargeId, customerid }
    return this.http.post(`${this.baseUrl}keva/GetKevaChargesByKevaChargeId?urlAddr=${orgName}`, params, this.httpOptions)
      .pipe(map(data => {
        console.log('CHARGES BY ID', data);
        return data = data['Data']
      }
      ), catchError(this.handleError));
  }

  getCustomerDetailsById(customerId: number) {
    return this.http.get(`${this.baseUrl}Customer/GetCustomerData?urlAddr=${this.generalService.getOrgName()}&customerid=${customerId}`, this.httpOptions)
      .pipe(map(data => {
        return data = data['Data']
      }));
  }

  updateKevaHistoryChargeStatus(orgName: string, params: UpdateKevaHistoryChargeStatus
    //  {KevaHistoryid: string, customerid: string, Remark: string, ReturnResonId: string, Kevaid: string, RecieptNo: string, RecieptType: string}
  ) {
    const updateParams = params;
    // { KevaHistoryid, customerid, Remark, ReturnResonId, Kevaid, RecieptNo, RecieptType }
    return this.http.get(`${this.baseUrl}keva/UpadateKevaHistoryChargeStatus?urlAddr=${orgName}&KevaHistoryid=${updateParams.KevaHistoryid}&customerid=${updateParams.customerid}&Remark=${updateParams.Remark}&ReturnResonId=${updateParams.ReturnResonId}&Kevaid=${updateParams.Kevaid}&RecieptNo=${updateParams.RecieptNo}&RecieptType=${updateParams.RecieptType}`, this.httpOptions)
      .pipe(map(data => data = data['Data']),
        catchError(this.handleError));
  }

  saveNewKeva(orgName: string, newKeva: NewKevaFull) {
    newKeva.customerInfo.addresses = newKeva.customerInfo.addresses
    console.log('SAVE NEW KEVA', newKeva);
    console.log('SAVE NEW KEVA STRING', JSON.stringify(newKeva));
    return this.http.post(`${this.baseUrl}keva/SaveCustomerKevaInfo?urlAddr=${orgName}`, newKeva, this.httpOptions)
      .pipe(map(data => data),
        catchError(this.handleError));
  }

  updateCUstomerKeva(orgName: string, newKeva: NewKevaFull) {
    console.log('UPDATE KEVA', newKeva);
    console.log('UPDATE KEVA STRING', JSON.stringify(newKeva));

    return this.http.post(`${this.baseUrl}keva/UpdateCustomerKevaInfo?urlAddr=${orgName}`, newKeva, this.httpOptions)
      .pipe(map(data => data),
        catchError(this.handleError));
  }

  deleteCustomerKeva(orgName: string, customerid: number, kevaid: number) {
    console.log(`customerid: ${customerid}, kevaid: ${kevaid}`)
    return this.http.get(`${this.baseUrl}keva/DeleteCustomerKevaInfo?urlAddr=${orgName}&customerid=${customerid}&kevaid=${kevaid}`, this.httpOptions)
      .pipe(map(data => data),
        catchError(this.handleError));
  }
  // &customerid=${customerid}&kevaid=${kevaid}
  concatMonthAndYear(monthValue: number, yearValue: number) {
    if (monthValue === null && yearValue === null) {
      return '';
    } else {
      return `${monthValue}/${yearValue}`;
    }
  }

  getKevaRemarksById(kevaId: number): Observable<KevaRemark[]> {

    const orgName = this.generalService.getOrgName()
    return this.http.get<Response>(`${this.baseUrl}keva/GetKevaRemarks?urlAddr=${orgName}&kevaid=${kevaId}`)
      .pipe(
        tap(data => console.log('GetKevaRemarks', data)),
        map(data => data.Data),
        catchError(this.handleError));
  }

  deleteKevaRemarksById(kevaRemark: KevaRemarkForUpdate) {
    const orgName = this.generalService.getOrgName();
    return this.http.post(`${this.baseUrl}keva/UpateKevaRemark?urlAddr=${orgName}`, kevaRemark);

  }

  updateKevaRemarkById(kevaRemark: KevaRemarkForUpdate) {
    const orgName = this.generalService.getOrgName();
    return this.http.post(`${this.baseUrl}keva/UpateKevaRemark?urlAddr=${orgName}`, kevaRemark);
  }

  setPaymentTablePage(tablePageState: { pageIndex: number, pageSize: number }) {
    this.paymentTablePage.next(tablePageState);
  }

  setListCustomerCreditCard(credCardList: CustomerCreditCard[]) {
    this.listCustomerCreditCard = credCardList;
  }

  getListCustomerCreditCard() {
    return this.listCustomerCreditCard;
  }

  setFilterValue(value: string) {
    this.filterValue.next(value);
  }

  setFilterValueByDay(value: string) {
    this.filterValueByDay.next(value);
  }

  setTablePaymentsDataToPaymentsService(paymentsTableData: PaymentKeva[]) {
    this.paymentsTableData.next(paymentsTableData);
  }

  setKevaCharges(kevaCharges: KevaCharge[]) {
    this.kevaChargesHistory.next(kevaCharges);
  }

  // setGlobalDataState(state: GlobalData) {
  //   this.globalData.next(state);
  // }

  // getGlobalDataState() {
  //   return this.globalData.getValue();
  // }

  // getGlobalData$() {
  //   return this.currentGlobalData$;
  // }

  // clearGlobalDataState() {
  //   this.globalData.next(<GlobalData>{})
  // }

  clearPaymentsTableState() {
    this.paymentsTableData.next(<PaymentKeva[]>[]);
  }

  // Error handling 
  handleError(error) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }

  refreshTablePageIndex() {
    this.paymentTablePage.next({ pageIndex: null, pageSize: null });
  }

  unsubscribe() {
    console.log('Payments service unsubscribe');
    this.subscription$.next();
    this.subscription$.complete();
  }

  clearCustomerDetailsInCUstomerInfoService() {
    this.customerInfoService.clearCurrentCustomerInfoByIdForCustomerInfoComponent();
  }

  updateKevaTable() {
    this.updateKevaTableClicked$.next(true);
  }


  setRouteForComeback(route: string) {
    this.routeForComeBack = route;
  }

  getRouteForComeback() {
    return this.routeForComeBack;
  }

  // getCustomerInfoForNewKeva() {
  //   return this.customerInfoService.getNewCustomer();
  // }

  // setCustomerInfoById(customerEmails: CustomerEmails[], customerPhones: CustomerPhones[], customerAddress: CustomerAddresses[],
  //   customerMainInfo: Customermaininfo[] | MainDetails[],
  //   customerCreditCardTokens?: any[], customerGroupList?: CustomerGroupById[]
  // ) {
  //   this.customerInfoService.setCustomerInfoById(customerEmails, customerPhones, customerAddress,
  //     customerMainInfo,
  //     customerCreditCardTokens, customerGroupList)
  // };

  // getCurrentCustomerInfo() {
  //  return this.customerDetails.getCustomerDetailsByIdState$();
  // }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('PAYMENTS SERVICE DESTROYED')
  }
}