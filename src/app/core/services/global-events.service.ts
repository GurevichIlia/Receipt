import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalEventsService {
  customerIdForSearch = new BehaviorSubject<number>(null);
  customerIdForSearch$ = this.customerIdForSearch.asObservable();
  constructor() { }


  setCustomerIdForSearch(customerId: number) {
    this.customerIdForSearch.next(customerId);
  }

  getCustomerIdForSearch$() {
    return this.customerIdForSearch$.pipe(filter(id => id !== null));
  }

}
