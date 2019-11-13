import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

export interface LastFilterOption {
  kevaTypeid: string | number,
  instituteid: number | string,
  KevaStatusid: number | string,
  KevaGroupid: string | number
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsTableHeaderService {
  lastFilterOption$ = new BehaviorSubject<LastFilterOption>(null);
  constructor() { }


  setLastFilterOption(filterOption: LastFilterOption) {
    this.lastFilterOption$.next(filterOption)
  }

  getLastFilterOption() {
    return this.lastFilterOption$.getValue();
  }
}
