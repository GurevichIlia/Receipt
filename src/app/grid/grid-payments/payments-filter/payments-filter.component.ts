import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { PaymentsService } from '../../payments.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-payments-filter',
  templateUrl: './payments-filter.component.html',
  styleUrls: ['./payments-filter.component.css']
})
export class PaymentsFilterComponent implements OnInit {
  filterForm: FormGroup;
  subscription$ = new Subject();
  globalData: object;
  constructor(
    private paymentsService: PaymentsService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createFilterForm();
    this.getGlobalData();
  }
  getGlobalData() {
    this.paymentsService.currentGlobalData$.subscribe(data => {
      this.globalData = data;
      console.log('filter comp', data)
    })
  }
  createFilterForm() {
    this.filterForm = this.fb.group({
      kevaTypeid: ['1'],
      instituteid: ['1'],
      KevaStatusid: [1],
      KevaGroupid: ['9999']
    })
  }
  get filterFormValue() {
    return this.filterForm;
  }
  showFilteredPayments() {
    console.log('Filter options', this.filterFormValue.value)
    this.paymentsService.getGridData(this.filterFormValue.value).pipe(takeUntil(this.subscription$)).subscribe(data => {
      this.paymentsService.paymentsTableData.next(data);
      console.log('DATA SOURCE', data)
    })
  }
  applyFilter(filterValue: string) {
    this.paymentsService.filterValue.next(filterValue);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription$.next();
    this.subscription$.complete();
  }
}
