import { takeUntil, mergeMap } from 'rxjs/operators';
import { PaymentsService } from 'src/app/grid/payments.service';
import { CustomerDetailsService } from './../../customer-details.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { PaymentKeva } from 'src/app/models/paymentKeva.model';

@Component({
  selector: 'app-kevas',
  templateUrl: './kevas.component.html',
  styleUrls: ['./kevas.component.css']
})
export class KevasComponent implements OnInit, OnDestroy {
  customerId$: Observable<number>
  filterValue = {
    kevaTypeid: '1',
    instituteid: '1',
    KevaStatusid: '9999',
    KevaGroupid: '9999'
  }
  subscription$ = new Subject();
  constructor(
    private customerDetailsService: CustomerDetailsService,
    private paymentsService: PaymentsService
  ) { }

  ngOnInit() {
    this.customerId$ = this.customerDetailsService.getCustomerId$();
    this.getTableData();
  }


  getTableData() {
    let gridData$: Observable<PaymentKeva[]>
    if (this.paymentsService.paymentsTableData.getValue().length !== 0) {

      gridData$ = of(this.paymentsService.paymentsTableData.getValue())
    } else {
      gridData$ = this.paymentsService.getGridData(this.filterValue)
    }

    gridData$.pipe(
      takeUntil(this.subscription$))
      .subscribe(tableData => this.paymentsService.setTablePaymentsDataToPaymentsService(tableData))
  }

  ngOnDestroy() {
    // this.paymentsService.setTablePaymentsDataToPaymentsService([]);
    this.subscription$.next();
    this.subscription$.complete();
  }
}
