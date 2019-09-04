import { SideBarService } from './side-bar/side-bar.service';
import { GeneralSrv } from './../receipts/services/GeneralSrv.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PaymentsService } from '../grid/payments.service';
import { FullCustomerDetailsById } from '../models/fullCustomerDetailsById.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerDetailsService {
  customerDetailsById = new BehaviorSubject<FullCustomerDetailsById>(null);
  customerDetailsById$ = this.customerDetailsById.asObservable();
  currentMenuItem = new BehaviorSubject<{ route: string, childMenuItem: string }>(null);
  currentMenuItem$ = this.currentMenuItem.asObservable();
  childMenuItem = new BehaviorSubject<string>('personalInfo');
  currentChildMenuItem$ = this.childMenuItem.asObservable();
  constructor(
    private paymentsService: PaymentsService,
    private generalService: GeneralSrv,

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
}
