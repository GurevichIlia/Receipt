import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalEventsService {
  customerId = new BehaviorSubject<number>(null);
  customerId$ = this.customerId.asObservable();
  constructor() { }


  setCustomerId(customerId: number) {
    this.customerId.next(customerId);
  }

  getCustomerId$() {
    return this.customerId$.pipe(filter(id => id !== null));
  }

}
