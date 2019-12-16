import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalEventsService {
  isUpdateCustomerSearchData = new BehaviorSubject<boolean>(false);
  isUpdateCustomerSearchData$ = this.isUpdateCustomerSearchData.asObservable();
  constructor() { }


  updateCustomerSearchData() {
    localStorage.removeItem('customerSearchData');
    this.isUpdateCustomerSearchData.next(true);
  }

  getIsUpdateCustomerSearchData$() {
    return this.isUpdateCustomerSearchData$;
  }

}
