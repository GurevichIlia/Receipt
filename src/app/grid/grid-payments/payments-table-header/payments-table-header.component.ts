import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { GlobalData } from 'src/app/models/globalData.model';
import { PaymentsService } from '../../payments.service';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-payments-table-header',
  templateUrl: './payments-table-header.component.html',
  styleUrls: ['./payments-table-header.component.css']
})
export class PaymentsTableHeaderComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  subscription$ = new Subject();
  globalData$: Observable<GlobalData | ''>;
  constructor(
    private paymentsService: PaymentsService,
    private fb: FormBuilder,
    private generalService: GeneralSrv,
    private router: Router
  ) { }

  ngOnInit() {
    this.getGlobalData();
    this.createFilterForm();
  }
  getTablePaymentsData() {
    console.log('Filter options', this.filterFormValue.value)
    this.paymentsService.getGridData(this.filterFormValue.value, this.generalService.orgName).pipe(takeUntil(this.subscription$)).subscribe(data => {
      this.paymentsService.setTablePaymentsDataToPaymentsService(data);
      console.log('DATA SOURCE', data);
    })
  }
  setPaymentType(type: string) {
    switch (type) {
      case '1':
        console.log('ONE')
        break;
      case '2':
       console.log('TWO')
        break;
      case '3':
        console.log('THREE')
        break;
    }
    this.paymentsService.setPaymentType(type);
    this.router.navigate(['payments-grid/customer-search']);
   
  }
  getGlobalData() {
    // this.paymentsService.currentGlobalData$.pipe(takeUntil(this.subscription$)).subscribe(data => {
    this.globalData$ = this.paymentsService.currentGlobalData$;
  }
  createFilterForm() {
    this.filterForm = this.fb.group({
      kevaTypeid: ['1'],
      instituteid: [1],
      KevaStatusid: [1],
      KevaGroupid: ['9999']
    })
  }
  get filterFormValue() {
    return this.filterForm;
  }
  goToKevaCharges() {
    this.router.navigate(['payments-grid/keva-charges']);
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription$.next();
    this.subscription$.complete();
    this.paymentsService.unsubscribe();// do unsubscribe in payments service
  }
}
