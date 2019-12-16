import { PaymentsTableHeaderService, LastFilterOption } from './payments-table-header.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { GlobalData } from 'src/app/models/globalData.model';
import { PaymentsService } from '../../payments.service';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { takeUntil, filter, switchMap } from 'rxjs/operators';
import { NewPaymentService } from '../new-payment/new-payment.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PaymentKeva } from 'src/app/models/paymentKeva.model';


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
    private newPaymentService: NewPaymentService,
    private fb: FormBuilder,
    private generalService: GeneralSrv,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private paymentsHeaderService: PaymentsTableHeaderService
  ) { }

  ngOnInit() {
    this.createFilterForm();
    this.getGlobalData();
    this.checkIfUpdateKevaTableWasClicked();
  }


  getTablePaymentsData() {
    this.spinner.start();
    // const lastFilterOption = this.paymentsHeaderService.getLastFilterOption();
    // const filterOptions = lastFilterOption ? lastFilterOption : this.filterFormValue.value;
    console.log('FILTER OPTION', this.filterFormValue.value);
    this.paymentsService.getGridData(this.filterFormValue.value, this.generalService.orgName)
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(data => {
        this.paymentsService.setTablePaymentsDataToPaymentsService(data);
        console.log('DATA SOURCE', data);
        this.paymentsHeaderService.setLastFilterOption(this.filterFormValue.value);
        this.spinner.stop();
      }, error => {
        this.spinner.stop();
        console.log(error)
      })
  }

  setLastFilterOption() {

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
    this.newPaymentService.setPaymentType(type);
    this.newPaymentService.setKevaMode('newKeva');
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
    // this.filterFormOptions = this.paymentsHeaderService.getLastFilterOption();
    console.log('FILTER FORM VALUE', this.filterFormValue)
  }

  get filterFormValue() {
    return this.filterForm;
  }

  set filterFormOptions(formValue: LastFilterOption) {
    if (formValue) {
      this.filterForm.patchValue({
        kevaTypeid: formValue.kevaTypeid,
        instituteid: formValue.instituteid,
        KevaStatusid: formValue.KevaStatusid,
        KevaGroupid: formValue.KevaGroupid
      })
    }
    //  else {
    //   this.filterForm.patchValue({
    //     kevaTypeid: '1',
    //     instituteid: 1,
    //     KevaStatusid: 1,
    //     KevaGroupid: '9999'
    //   })
    // }

  }
  goToKevaCharges() {
    this.router.navigate(['payments-grid/keva-charges']);
  }

  checkIfUpdateKevaTableWasClicked() {
    this.paymentsService.updateKevaTableClicked$
      .pipe(
        filter(event => event !== null),
        takeUntil(this.subscription$))
      .subscribe((event: boolean) => {
        this.filterFormOptions = this.paymentsHeaderService.getLastFilterOption() ?
          this.paymentsHeaderService.getLastFilterOption() : {
            kevaTypeid: '1',
            instituteid: 1,
            KevaStatusid: 1,
            KevaGroupid: '9999'
          };
        this.getTablePaymentsData();
        console.log('TABLE UPDATED', event);
      })
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription$.next();
    this.subscription$.complete();
    this.paymentsService.unsubscribe();// do unsubscribe in payments service
  }
}
