import { CreditCardList } from './../../models/creditCardList.model';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { PaymentsService } from './../payments.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-grid-payments',
  templateUrl: './grid-payments.component.html',
  styleUrls: ['./grid-payments.component.css'],
  providers: [PaymentsService]
})
export class GridPaymentsComponent implements OnInit, OnDestroy {
  subscription$ = new Subject();
  constructor(
    private paymentsService: PaymentsService,
    private generalService: GeneralSrv
  ) { }

  ngOnInit() {
    this.getCustomerCreditCardList();
    this.getKevaGlobalData();
  }
  getCustomerCreditCardList() {
    this.paymentsService.getCustomerCreditCardListData(this.generalService.orgName)
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: CreditCardList[]) => this.paymentsService.setCreditCardList(data)),
      error => console.log(error);
  }
  getKevaGlobalData() {
    this.paymentsService.getKevaGlbData(this.generalService.getOrgName())
    .pipe(
      takeUntil(this.subscription$))
      .subscribe(data => {
        this.paymentsService.setGlobalDataState(data);
        console.log('GLOBAL DATA', data);
      })
  }
  ngOnDestroy() {
    this.subscription$.next();
    this.subscription$.complete();
    console.log('GRID DESTROYED')
  }
}
