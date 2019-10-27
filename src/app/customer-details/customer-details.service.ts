import { HttpClient, HttpParams } from '@angular/common/http';
import { FullCustomerDetailsById } from 'src/app/models/fullCustomerDetailsById.model';
import { GeneralSrv } from './../receipts/services/GeneralSrv.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PaymentsService } from '../grid/payments.service';
import { Router } from '@angular/router';
import { CustomerInfoService } from '../receipts/customer-info/customer-info.service';
import { Response } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerDetailsService {
  currentCustomerId = new BehaviorSubject<number>(null);
  customerDetailsById = new BehaviorSubject<FullCustomerDetailsById>(null);
  customerDetailsById$ = this.customerDetailsById.asObservable();
  currentMenuItem = new BehaviorSubject<{ route: string, childMenuItem: string }>(null);
  currentMenuItem$ = this.currentMenuItem.asObservable();
  childMenuItem = new BehaviorSubject<string>('personalInfo');
  currentChildMenuItem$ = this.childMenuItem.asObservable();
  baseUrl = 'https://jaffawebapisandbox.amax.co.il/API/';
  constructor(
    private paymentsService: PaymentsService,
    private generalService: GeneralSrv,
    private router: Router,
    private customerInfoService: CustomerInfoService,
    private http: HttpClient

  ) { console.log('CUSTOMER DETAILS SERVICE LOADED') }

  getCustomerDetailsById(customerId: number): Observable<FullCustomerDetailsById> {
    return this.paymentsService.getCustomerDetailsById(customerId);
  }

  setCustomerDetailsByIdState(value) {
    this.customerDetailsById.next(value);
  }

  getCustomerDetailsByIdState() {
    return this.customerDetailsById.getValue();
  }

  getCustomerDetailsByIdState$(): Observable<FullCustomerDetailsById> {
    return this.customerDetailsById$;
  }

  getGlobalData$() {
    return this.generalService.getGlobalData$();
  }

  getDisplayWidth() {
    return this.generalService.currentSizeOfWindow$;
  }

  setCurrentMenuItem(menuItem: { route: string, childMenuItem: string }) {
    this.currentMenuItem.next({ route: menuItem.route, childMenuItem: '' });
    this.setChildMenuItem(menuItem.childMenuItem)
  }

  getCurrentMenuItem$() {
    return this.currentMenuItem$;
  }

  setChildMenuItem(childMenuItem: string) {
    this.childMenuItem.next(childMenuItem);
  }

  getChildMenuItem$() {
    return this.currentChildMenuItem$;
  }

  goToCreateNewReceiptPage() {
    this.setCustomerInfoForNewReceipt(this.customerDetailsById.getValue());
    this.router.navigate(['/home/newreceipt']);
  }

  setCustomerInfoForNewReceipt(customerInfo: FullCustomerDetailsById) {
    this.customerInfoService.setCustomerInfoById(customerInfo.CustomerEmails, customerInfo.GetCustomerPhones, customerInfo.CustomerAddresses, customerInfo.CustomerCard_MainDetails, customerInfo.CustomerCreditCardTokens)
  }

  saveChangedCustomerData(newCustomerData: {} | []){
    const orgName = this.generalService.getOrgName();
    let params: HttpParams = new HttpParams().set('customerid', this.getCustomerId().toString());
    console.log('NEW CUSTOMER DATA', newCustomerData);
    return this.http.post(`${this.baseUrl}Customer/SaveCustomerInfo?urlAddr=${orgName}`, newCustomerData, {params});
  }

  setCustomerId(customerId: number) {
    this.currentCustomerId.next(customerId);
  }

  getCustomerId() {
    return this.currentCustomerId.getValue();
  }

  clearCurrentMenuItem() {
    this.currentMenuItem.next(null);
  }


}
