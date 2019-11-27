import { FormControl } from '@angular/forms';
import { GlobalStateService } from './../shared/global-state-store/global-state.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FullCustomerDetailsById, } from 'src/app/models/fullCustomerDetailsById.model';
import { GeneralSrv, CustomerSearchData } from './../receipts/services/GeneralSrv.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PaymentsService } from '../grid/payments.service';
import { Router } from '@angular/router';
import { CustomerInfoService } from '../receipts/customer-info/customer-info.service';

import { debounceTime, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerDetailsService {
  currentCustomerId = new BehaviorSubject<number>(null);
  currentCustomerId$ = this.currentCustomerId.asObservable();
  // customerDetailsById = new BehaviorSubject<FullCustomerDetailsById>(null);
  // customerDetailsById$ = this.customerDetailsById.asObservable();
  currentMenuItem = new BehaviorSubject<{ route: string, childMenuItem: string }>(null);
  currentMenuItem$ = this.currentMenuItem.asObservable();
  childMenuItem = new BehaviorSubject<string>('personalInfo');
  currentChildMenuItem$ = this.childMenuItem.asObservable();

  updateCustomerInfo$ = new BehaviorSubject<boolean>(null);
  baseUrl = 'https://jaffawebapisandbox.amax.co.il/API/';
  constructor(
    private paymentsService: PaymentsService,
    private generalService: GeneralSrv,
    private router: Router,
    private customerInfoService: CustomerInfoService,
    private http: HttpClient,
    private globalStateService: GlobalStateService

  ) { console.log('CUSTOMER DETAILS SERVICE LOADED') }

  // getCustomerDetailsById(customerId: number): Observable<FullCustomerDetailsById> {
  //   return this.paymentsService.getCustomerDetailsById(customerId);
  // }

  getCustomerDetailsById(customerId: number): Observable<FullCustomerDetailsById> {
    return this.http.get(`${this.baseUrl}Customer/GetCustomerData?urlAddr=${this.generalService.getOrgName()}&customerid=${customerId}`)
      .pipe(map(data => {
        return data = data['Data']
      }));
  }

  // setCustomerDetailsByIdState(value) {
  //   this.customerDetailsById.next(value);
  // }

  // getCustomerDetailsByIdState() {
  //   return this.customerDetailsById.getValue();
  // }

  // getCustomerDetailsByIdState$(): Observable<FullCustomerDetailsById> {
  //   return this.customerDetailsById$;
  // }

  setCustomerDetailsByIdState(value) {
    this.globalStateService.setCustomerDetailsByIdGlobalState(value);
  }

  getCustomerDetailsByIdState() {
    return this.globalStateService.getCustomerDetailsByIdGlobalState();
  }

  getCustomerDetailsByIdState$(): Observable<FullCustomerDetailsById> {
    return this.globalStateService.getCustomerDetailsByIdGlobalState$();
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
    this.setCustomerInfoForNewReceipt(this.getCustomerDetailsByIdState());
    this.router.navigate(['/home/newreceipt']);
  }

  setCustomerInfoForNewReceipt(customerInfo: FullCustomerDetailsById) {
    this.customerInfoService.setCurrentCustomerInfoByIdForCustomerInfoComponent(
      this.globalStateService.getCustomerDetailsByIdTranformedForCUstomerInfoComponent()
    )
    // this.customerInfoService.setCustomerGroupList(this.globalStateService.getCustomerDetailsByIdGlobalState().CustomerGroupsGeneralSet)
  }

  saveChangedCustomerData(newCustomerData: {} | []) {
    const orgName = this.generalService.getOrgName();
    let params: HttpParams = new HttpParams().set('customerid', this.getCustomerId().toString());
    console.log('NEW CUSTOMER DATA', newCustomerData);
    return this.http.post(`${this.baseUrl}Customer/SaveCustomerInfo?urlAddr=${orgName}`, newCustomerData, { params });
  }

  setCustomerId(customerId: number) {
    this.currentCustomerId.next(customerId);
  }

  getCustomerId() {
    return this.currentCustomerId.getValue();
  }

  getCustomerId$() {
    return this.currentCustomerId$;
  }

  clearCurrentMenuItem() {
    this.currentMenuItem.next(null);
  }

  setGlobalCustomerDetails(customerDetails: FullCustomerDetailsById) {
    this.globalStateService.setCustomerDetailsByIdGlobalState(customerDetails)
  }

  customerListAutocomplete(searchControl: FormControl, customerList: Observable<CustomerSearchData[]>) {
    const filteredOptions$ = searchControl.valueChanges
      .pipe(
        debounceTime(1),
        switchMap((value: string) => customerList
          .pipe(
            map(customers => customers
              .filter(customer => customer.FileAs1.toLowerCase().includes(value.toLowerCase()))))
        ),
      );
    return filteredOptions$
  }

  updateCustomerInfo() {
    this.updateCustomerInfo$.next(true);
  }
  // private _filter(value: string, customerList: Observable<CustomerSearchData[]>): string[] {
  //   const filterValue = value.toLowerCase();
  //   return customerList.pipe(filter(user => user['FileAs1'].toLowerCase().includes(filterValue)));

  // }



}
