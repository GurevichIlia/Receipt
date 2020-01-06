import { CustomerDetailsService } from './../../../customer-details/customer-details.service';
import { PaymentsTableHeaderService, LastFilterOption } from './payments-table-header.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { GlobalData } from 'src/app/models/globalData.model';
import { PaymentsService } from '../../payments.service';
import { GeneralSrv } from 'src/app/shared/services/GeneralSrv.service';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { NewPaymentService } from '../new-payment/new-payment.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material';
import { ChargesByChargeIdComponent } from '../payments-history/charges-byChargeId-modal/charges-by-charge-id.component';
import { KevaCharge } from 'src/app/models/kevaCharge.model';


@Component({
  selector: 'app-payments-table-header',
  templateUrl: './payments-table-header.component.html',
  styleUrls: ['./payments-table-header.component.css']
})
export class PaymentsTableHeaderComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  subscription$ = new Subject();
  globalData$: Observable<GlobalData>;
  currentRoute = ''
  isShowGroupsFIlter: boolean;
  constructor(
    private paymentsService: PaymentsService,
    private newPaymentService: NewPaymentService,
    private fb: FormBuilder,
    private generalService: GeneralSrv,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private paymentsHeaderService: PaymentsTableHeaderService,
    private dialog: MatDialog,
    private customerDetailsService: CustomerDetailsService
  ) { }

  ngOnInit() {
    this.getGlobalData();
    this.createFilterForm();

    this.checkIfUpdateKevaTableWasClicked();
    this.getCurrentRoute();
  }


  getTablePaymentsData() {
    this.spinner.start();
    // const lastFilterOption = this.paymentsHeaderService.getLastFilterOption();
    // const filterOptions = lastFilterOption ? lastFilterOption : this.filterFormValue.value;
    console.log('FILTER OPTION', this.filterFormValue.value);
    this.paymentsService.getGridData(this.filterFormValue.value)
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
    this.globalData$ = this.generalService.getGlobalData$().pipe(tap(data => console.log('GLOBAL DATA', data)));
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
  goToKevaHistory() {
    if (this.currentRoute === '/customer-details/customer/payments/kevas') {
      this.showKevaHistory()
    } else {
      this.router.navigate(['payments-grid/keva-charges']);

    }
  }

  showKevaHistory() {
    const keva = ''
    const customerId = this.customerDetailsService.getCustomerId() ? this.customerDetailsService.getCustomerId().toString() : '';
    this.dialog.open(ChargesByChargeIdComponent, { width: '1500px', height: '700px', data: { keva, customerId } })
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

  getCurrentRoute() {
    this.currentRoute = this.generalService.getCurrentRoute();
    if (this.currentRoute === '/customer-details/customer/payments/kevas') {
      this.isShowGroupsFIlter = false;
    } else {
      this.isShowGroupsFIlter = true;
    }
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription$.next();
    this.subscription$.complete();
    this.paymentsService.unsubscribe();// do unsubscribe in payments service
  }
}
