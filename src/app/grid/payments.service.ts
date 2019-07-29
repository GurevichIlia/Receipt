import { AuthenticationService } from '../services/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';

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
  paymentsTableData = new Subject();
  currentPaymentsTableData$ = this.paymentsTableData.asObservable();
  globalData = new BehaviorSubject<object>({});
  currentGlobalData$ = this.globalData.asObservable();
  filterValue = new Subject();
  currentFilterValue$ = this.filterValue.asObservable();
  paymentType = new BehaviorSubject('');
  currentPaymentType = this.paymentType.asObservable();
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.tokenNo
      })
    };
  }

  getGridData(filterParams: { kevaTypeid: string, instituteid: string, KevaStatusid: string, KevaGroupid: string }) {
    return this.http.post(`${this.baseUrl}keva/GetKevaListData?urlAddr=jaffanet1`, filterParams, this.httpOptions).pipe(map(data => data = data['Data']))
  }
  getKevaGlbData() {
    return this.http.get(`${this.baseUrl}keva/GetKevaGlbData?urlAddr=jaffanet1`, this.httpOptions).pipe(map(data => data = data['Data']))
  }
}