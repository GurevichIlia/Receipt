import { KevaCharge } from './../models/kevaCharge.model';
import { Projects4Receipt } from './../models/projects4receipt.model';
import { GlobalData } from './../models/globalData.model';
import { AuthenticationService } from '../receipts/services/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable, throwError } from 'rxjs';
import { ReceiptsService } from '../receipts/services/receipts.service';
import { Customerinfo } from '../models/customerInfo.model';
import { GeneralSrv } from '../receipts/services/GeneralSrv.service';
import { PaymentKeva } from '../models/paymentKeva.model';
import { FormGroup } from '@angular/forms';
import { NewKevaDetails } from '../models/newKevaDetails.model';

import * as moment from 'moment';
import { CustomerCreditCard } from '../models/customerCreditCard.model';
import { CreditCardList } from '../models/creditCardList.model';
import { KevaChargeById } from '../models/kevaChargeById.model';
import { UpdateKevaHistoryChargeStatus } from '../models/upadateKevaHistoryChargeStatus.model';


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
    { value: 'KEVAEnd', label: ' שימוש פנימי\ סיום' },
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

  globalData = new BehaviorSubject<GlobalData>(undefined);
  /** Using this data in payments part of application */
  currentGlobalData$ = this.globalData.asObservable();

  filterValue = new Subject();
  currentFilterValue$ = this.filterValue.asObservable();

  filterValueByDay = new Subject();
  currentFilterValueByDay$ = this.filterValueByDay.asObservable();

  paymentType = new BehaviorSubject('');
  currentPaymentType$ = this.paymentType.asObservable();

  customerInfo: BehaviorSubject<Customerinfo> = new BehaviorSubject(<Customerinfo>{});
  currentCustomerInfo$ = this.customerInfo.asObservable();

  editingPayment = new BehaviorSubject<PaymentKeva | ''>('');
  currentEditingPayment$ = this.editingPayment.asObservable();

  paymentTablePage = new BehaviorSubject<{ pageIndex: number, pageSize: number }>({ pageIndex: 0, pageSize: 10 })
  currentPaymentTablePage$ = this.paymentTablePage.asObservable();

  customertCreditCardList = new BehaviorSubject<CreditCardList[]>([]);
  currentCreditCardList$ = this.customertCreditCardList.asObservable();

  kevaChargesHistory = new BehaviorSubject<KevaCharge[]>([]);
  currentKevaChargesHistory = this.kevaChargesHistory.asObservable();

  listCustomerCreditCard: CustomerCreditCard[] = [];
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,

  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.tokenNo
      })
    };
    console.log('Service payment loaded');
    this.getKevaGlbData(this.generalService.orgName);
  }
  getCustomerInfo() {
    this.customerInfo.next(this.receiptService.getCustomerInfo());
    console.log('CUSTOMER INFO', this.customerInfo)
  }
  getGridData(filterParams: { kevaTypeid: string, instituteid: string, KevaStatusid: string, KevaGroupid: string }, orgName: string): Observable<PaymentKeva[]> {
    return this.http.post(`${this.baseUrl}keva/GetKevaListData?urlAddr=${orgName}`, filterParams, this.httpOptions)
      .pipe(map(data => data = data['Data']
      ),
        map(data => data.map((data: PaymentKeva) => {
          // data.LastChargeDate = data.LastChargeDate === null ? '' : this.generalService.changeDateFormat(data.LastChargeDate, 'YYYY/MM/DD');
          data.createDate = this.generalService.changeDateFormat(data.createDate, 'YYYY/MM/DD');
          data.creditCardMonthAndYears = this.concatMonthAndYear(data.creditCardMonth, data.creditCardYear); // create new pair key/value;
          data.KEVACancleDate = this.generalService.changeDateFormat(data.KEVACancleDate, 'YYYY/MM/DD');
          data.KEVAEnd = this.generalService.changeDateFormat(data.KEVAEnd, 'YYYY/MM/DD');
          data.KEVAJoinDate = this.generalService.changeDateFormat(data.KEVAJoinDate, 'YYYY/MM/DD');
          data.KEVAStart = this.generalService.changeDateFormat(data.KEVAStart, 'YYYY/MM/DD');
          return data;
        })
        ));
  }
  getKevaGlbData(orgName: string) {
    return this.http.get(`${this.baseUrl}keva/GetKevaGlbData?urlAddr=${orgName}`, this.httpOptions)
      .pipe(map(data => data = data['Data']));

  }
  getCustomerCreditCardListData(orgName: string) {
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
  updateKevaHistoryChargeStatus(orgName: string, params: UpdateKevaHistoryChargeStatus
    //  {KevaHistoryid: string, customerid: string, Remark: string, ReturnResonId: string, Kevaid: string, RecieptNo: string, RecieptType: string}
  ) {
    const updateParams = params;
    // { KevaHistoryid, customerid, Remark, ReturnResonId, Kevaid, RecieptNo, RecieptType }
    return this.http.get(`${this.baseUrl}keva/UpadateKevaHistoryChargeStatus?urlAddr=${orgName}&KevaHistoryid=${updateParams.KevaHistoryid}&customerid=${updateParams.customerid}&Remark=${updateParams.Remark}&ReturnResonId=${updateParams.ReturnResonId}&Kevaid=${updateParams.Kevaid}&RecieptNo=${updateParams.RecieptNo}&RecieptType=${updateParams.RecieptType}`, this.httpOptions)
      .pipe(map(data => data = data['Data']), catchError(this.handleError));
  }
  updatePaymentFormForEditeMode(paymentForm: FormGroup, newData: PaymentKeva | null) {
    paymentForm.get('firstStep').patchValue({
      type: String(newData.HokType),
      status: newData.KevaStatusId,
      groups: newData.GroupId
    });
    paymentForm.get('secondStep').patchValue({
      fileAs: newData.FileAs,
      ID: newData.ID,
      tel1: newData.Phone1,
      tel2: newData.Phone2,
      remark: ''
    });
    paymentForm.get('thirdStep.bank').patchValue({
      codeBank: newData.BankCode.trim(),
      snif: newData.SnifNo.trim(),
      accNumber: newData.AccountNo.trim()
    });
    paymentForm.get('thirdStep.creditCard').patchValue({
      credCard: newData.customercreditCardid
    });
    paymentForm.get('fourthStep').patchValue({
      amount: newData.MountToCharge,
      currency: newData.CurrencyId,
      day: newData.HokChargeDay,
      company: newData.instituteId,
      startDate: this.generalService.changeDateFormat(newData.KEVAStart, 'YYYY-MM-DD'),
      endDate: this.generalService.changeDateFormat(newData.KEVAEnd, 'YYYY-MM-DD'),
      KEVAJoinDate: this.generalService.changeDateFormat(newData.KEVAJoinDate, 'YYYY-MM-DD'),
      KEVACancleDate: this.generalService.changeDateFormat(newData.KEVACancleDate, 'YYYY-MM-DD'),
      monthToCharge: newData.TotalMonthtoCharge,
      chargeMonth: newData.TotalChargedMonth,
      leftToCharge: newData.TotalLeftToCharge,
      tadirut: newData.tadirut
    });
    paymentForm.get('fifthStep').patchValue({
      receipt: newData.RecieptTypeId,// receipt ForCanclation: false
      receipt2: newData.RecieptTypeIdREC,// receipt ForCanclation: true
      goal: newData.HokDonationTypeId,
      account: newData.AccountID,
      projCat: this.searchProjectCatId(newData.ProjectName, this.globalData.value.Projects4Receipts),
      project: this.searchProjectId(newData.ProjectName, this.globalData.value.Projects4Receipts),
      input1: newData.EmployeeId,
      thanksLetter: newData.ThanksLetterId,
      fileAs: newData.FileAs,
      address: newData.Address,
      field: '',
      checkbox: ''
    })
  }
  searchProjectCatId(projectName: string, projectsList: Projects4Receipt[]) {
    let projectCat;
    projectsList.filter((project: Projects4Receipt) => project.ProjectName === projectName ? projectCat = project.ProjectCategoryId : '');
    console.log('CAT', projectCat);
    return projectCat;
  }
  searchProjectId(projectName: string, projectsList: Projects4Receipt[]) {
    let projectId;
    projectsList.filter((project: Projects4Receipt) => project.ProjectName === projectName ? projectId = project.ProjectId : '');
    console.log('projectId', projectId);
    return projectId;
  }
  setPaymentType(type: string) {
    this.paymentType.next(type);
  }
  setEditingPayment(payment) {
    this.editingPayment.next(payment);
  }
  concatMonthAndYear(monthValue: number, yearValue: number) {
    if (monthValue === null && yearValue === null) {
      return '';
    } else {
      return `${monthValue}/${yearValue}`;
    }
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
  setNewPaymentKeva(newKevaData) {
    const newKeva = {
      customerInfo: this.receiptService.getCustomerInfo(),
      HokType: newKevaData.firstStep.type,
      KevaDetails: <NewKevaDetails>{
        Customerid: null,
        MountToCharge: newKevaData.fourthStep.amount,
        HokDonationTypeId: newKevaData.fifthStep.goal,
        AccountID: newKevaData.fifthStep.account,
        KEVAStart: moment(newKevaData.fourthStep.startDate).format('YYYY-MM-DD'),
        KEVAEnd: moment(newKevaData.fourthStep.endDate).format('YYYY-MM-DD'),
        KEVANAME: null,
        ShortComment: newKevaData.secondStep.remark,
        BankCode: newKevaData.thirdStep.bank.codeBank,
        AccountNo: newKevaData.thirdStep.bank.accNumber,
        SnifNo: newKevaData.thirdStep.bank.snif,
        ID: newKevaData.secondStep.ID,
        customercreditCardid: newKevaData.thirdStep.credCard,
        TotalMonthtoCharge: newKevaData.fourthStep.monthToCharge,
        TotalChargedMonth: newKevaData.fourthStep.chargeMonth,
        TotalLeftToCharge: newKevaData.fourthStep.leftToCharge,
        CurrencyId: newKevaData.fourthStep.currency,
        EmployeeId: null,
        HokProjectId: newKevaData.fifthStep.project,
        KEVAJoinDate: moment(newKevaData.fourthStep.KEVAJoinDate).format('YYYY-MM-DD'),
        KEVACancleDate: moment(newKevaData.fourthStep.KEVACancleDate).format('YYYY-MM-DD'),
        LastChargeDate: null,
        HokChargeDay: newKevaData.fourthStep.day,
        instituteId: newKevaData.fourthStep.company,
        RecieptTypeId: newKevaData.fifthStep.receipt,
        RecieptTypeIdREC: newKevaData.fifthStep.receipt2,
        HokType: newKevaData.firstStep.type,
        NameOnTheReciept: null,
        Address: newKevaData.fifthStep.address,
        Phone1: newKevaData.secondStep.tel1,
        Phone2: newKevaData.secondStep.tel2,
        KevaStatusId: newKevaData.firstStep.status,
        NewSumToCharge: null,
        NewSumAfterChargeNo: null,
        GroupId: null,
        createDate: null,
        tadirut: newKevaData.fourthStep.tadirut,
        endchargedate: null,
        maxToCharge: null,
        ThanksLetterId: newKevaData.fifthStep.thanksLetter,
        KevaMakeRecieptByYear: null,
        email: null
      }
    };
    console.log('NEW KEVA', newKeva);
    console.log('NEW KEVA', JSON.stringify(newKeva));
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
  setCreditCardList(creditCardList: CreditCardList[]) {
    this.customertCreditCardList.next(creditCardList);
  }
  setKevaCharges(kevaCharges: KevaCharge[]) {
    this.kevaChargesHistory.next(kevaCharges);
  }
  setGlobalDataState(state: GlobalData) {
    this.globalData.next(state)
  }
  clearPaymentsTableState() {
    this.paymentsTableData.next(<PaymentKeva[]>[]);
    this.currentPaymentsTableData$.subscribe(data => console.log('TABLE DATA AFTER CLEAR', data))
  }
  clearGlobalDataState() {
    this.globalData.next(<GlobalData>{})
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
  unsubscribe() {
    console.log('Payments service unsubscribe');
    this.subscription$.next();
    this.subscription$.complete();
  }
  ngOnDestroy(): void {
    this.clearPaymentsTableState();
    this.clearGlobalDataState();
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('PAYMENTS SERVICE DESTROYED')
  }
}
