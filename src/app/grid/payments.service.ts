import { AuthenticationService } from '../services/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { ReceiptsService } from '../services/receipts.service';
import { Customerinfo } from '../models/customerInfo.model';
import { GeneralSrv } from '../services/GeneralSrv.service';
import { PaymentKeva } from '../models/paymentKeva.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  displayedColumns: { value: string, label: string }[] = [
    { value: 'CustomerId', label: 'קוד כרטיס' },
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
    { value: 'Card number', label: 'מספר כרטיס' },
    { value: 'Valid month', label: 'חודש-תוקף' },
    { value: 'Valid year', label: 'שנה-תוקף' },
    { value: 'TotalMonthtoCharge', label: 'חודשים לחיוב' },
    { value: 'TotalChargedMonth', label: 'חודשים שחויבו' },
    { value: 'FileAs', label: 'שמ לקוח' },
    { value: 'CurrencyId', label: 'מטבע' },
    { value: 'empName', label: 'מגייס' },
    { value: 'KevaStatusIdname', label: 'מצב הוק' },
    { value: '4', label: 'שם פרוייקט' },
    { value: 'KEVAJoinDate', label: 'תאריך פתיחה' },
    { value: 'KEVACancleDate', label: 'תאריך ביטול' },
    { value: 'LastChargeDate', label: 'חיוב אחרון' },
    { value: 'ID', label: 'תז/חפ' },
    { value: 'Havur', label: 'עבור' },
    { value: 'AccName', label: 'לחשבון' },
    { value: 'NameOnTheReciept', label: 'שם לקבלה' },
    { value: 'Address', label: 'כתובת לקבלה' },
    { value: 'Phone1', label: 'טל 1' },
    { value: 'Phone2', label: 'טל 2' },
    { value: 'NewSumToCharge', label: 'סכום חדש לחיוב' },
    { value: 'NewSumAfterChargeNo', label: 'סכום חדש בעוד' },
    { value: 'RecieptTypeId', label: 'סוג קבלה' },
    { value: 'cvv', label: 'cvv' },
    { value: 'LastReturnResonInfo', label: 'מצב שידור אחרון' },
    { value: 'TypeNameHeb', label: 'סוג כרטיס' },
    { value: 'GetCreditTokefMonth', label: 'מוקף חודשום' },
    { value: 'GetcreditCardTypeName', label: 'חברת אשראי' },
    { value: 'tadirut', label: 'תדירות' },
    { value: 'KevaMakeRecieptByYear', label: 'הפקת קבלה' },
    { value: 'GetThanksLetterName', label: 'תבנית הקבלה' },
  ]
  baseUrl = 'https://jaffawebapisandbox.amax.co.il/API/';
  httpOptions;
  subscription$ = new Subject<void>();
  paymentsTableData = new BehaviorSubject<PaymentKeva[]>([]);
  currentPaymentsTableData$ = this.paymentsTableData.asObservable();

  globalData = new BehaviorSubject<object>({});
  /** Using this data in payments part of application */
  currentGlobalData$ = this.globalData.asObservable();

  filterValue = new Subject();
  currentFilterValue$ = this.filterValue.asObservable();

  paymentType = new BehaviorSubject('');
  currentPaymentType$ = this.paymentType.asObservable();

  customerInfo: BehaviorSubject<Customerinfo> = new BehaviorSubject(<Customerinfo>{});
  currentCustomerInfo$ = this.customerInfo.asObservable();

  editingPayment = new BehaviorSubject<PaymentKeva | ''>('');
  currentEditingPayment$ = this.editingPayment.asObservable();
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.tokenNo
      })
    };
    console.log('Service payment loaded');
    this.getKevaGlbData();
  }
  getCustomerInfo() {
    this.customerInfo.next(this.receiptService.getCustomerInfo());
    console.log('CUSTOMER INFO', this.customerInfo)
  }
  getGridData(filterParams: { kevaTypeid: string, instituteid: string, KevaStatusid: string, KevaGroupid: string }): Observable<PaymentKeva[]> {
    return this.http.post(`${this.baseUrl}keva/GetKevaListData?urlAddr=jaffanet1`, filterParams, this.httpOptions)
      .pipe(map(data => data = data['Data']
      ),
        map(data => data.map(data => {
          data.LastChargeDate = data.LastChargeDate === null ? '' : this.generalService.changeDateFormat(data.LastChargeDate, 'YYYY-MM-DD');
          data.KEVACancleDate = this.generalService.changeDateFormat(data.KEVACancleDate, 'YYYY-MM-DD');
          data.KEVAEnd = this.generalService.changeDateFormat(data.KEVAEnd, 'YYYY-MM-DD');
          data.KEVAJoinDate = this.generalService.changeDateFormat(data.KEVAJoinDate, 'YYYY-MM-DD');
          data.KEVAStart = this.generalService.changeDateFormat(data.KEVAStart, 'YYYY-MM-DD');
          return data;
        })
        ));
  }

  getKevaGlbData() {
    return this.http.get(`${this.baseUrl}keva/GetKevaGlbData?urlAddr=jaffanet1`, this.httpOptions)
      .pipe(map(data => data = data['Data']),
        takeUntil(this.subscription$))
      .subscribe(data => {
        this.globalData.next(data);
        console.log('GLOBAL DATA', data);
      })
  }
  updatePaymentForm(paymentForm: FormGroup, newData: PaymentKeva | null) {
    debugger;
    paymentForm.get('firstStep').patchValue({
      type: String(newData.HokType),
      status: newData.KevaStatusId,
      groups: newData.GroupId
    });
    paymentForm.get('secondStep').patchValue({
      fileAs: newData.FileAs,
    });
    paymentForm.get('thirdStep.bank').patchValue({
      codeBank: newData.BankCode.trim(),
      snif: newData.SnifNo.trim(),
      accNumber: newData.AccountNo.trim()
    });
    paymentForm.get('thirdStep.creditCard').patchValue({
      credCard: newData.customercreditCardid
    });

  }
  setPaymentType(type: string) {
    this.paymentType.next(type);
  }
  setEditingPayment(payment) {
    this.editingPayment.next(payment);
  }
  unsubscribe() {
    console.log('Payments service unsubscribe')
    this.subscription$.next();
    this.subscription$.complete();
  }
}