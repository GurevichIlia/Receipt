import { Component, OnInit } from '@angular/core';
import { PaymentsService } from '../payments.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-grid-payments',
  templateUrl: './grid-payments.component.html',
  styleUrls: ['./grid-payments.component.css']
})
export class GridPaymentsComponent implements OnInit {
  filterForm: FormGroup;
  subscription$ = new Subject();
  globalData: object;
  constructor(
    private paymentsService: PaymentsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getGlobalData();
    this.createFilterForm();
  }
  getGlobalData() {
    this.paymentsService.currentGlobalData$.pipe(takeUntil(this.subscription$)).subscribe(data => {
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
  applyFilter(filterValue: string) {
    console.log(filterValue)
    this.paymentsService.filterValue.next(filterValue);
  }
  showFilteredPayments() {
    console.log('Filter options', this.filterFormValue.value)
    this.paymentsService.getGridData(this.filterFormValue.value).pipe(takeUntil(this.subscription$)).subscribe(data => {
      this.paymentsService.paymentsTableData.next(data);
      console.log('DATA SOURCE', data)

    })
  }
  setPaymentType(type: string) {
    this.paymentsService.setPaymentType(type);
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.paymentsService.unsubscribe();// do unsubscribe in payments service
  }
}
