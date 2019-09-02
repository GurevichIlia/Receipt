import { GlobalData } from './../../models/globalData.model';
import { CreditCardList } from './../../models/creditCardList.model';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { PaymentsService } from './../payments.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NewPaymentService } from './new-payment/new-payment.service';


@Component({
  selector: 'app-grid-payments',
  templateUrl: './grid-payments.component.html',
  styleUrls: ['./grid-payments.component.css'],
  providers: []
})
export class GridPaymentsComponent implements OnInit, OnDestroy {
  subscription$ = new Subject();
  constructor(
    private paymentsService: PaymentsService,
    private generalService: GeneralSrv,
    private newPaymentService: NewPaymentService
  ) { }

  ngOnInit() {
    this.getCustomersCreditCardList();
    this.getKevaGlobalData();
  }
  getCustomersCreditCardList() {
    this.paymentsService.getCustomersCreditCardListData(this.generalService.orgName)
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: CreditCardList[]) => this.newPaymentService.setCreditCardList(data)),
      error => console.log(error);
  }
  getKevaGlobalData() {
    this.paymentsService.getKevaGlbData(this.generalService.getOrgName())
      .pipe(takeUntil(this.subscription$))
      .subscribe((data: GlobalData) => {
        this.paymentsService.setGlobalDataState(data)
        console.log('GLOBAL DATA', data);
      })
    // this.to_camel_case("The-stealth-warrior");
  }
  ngOnDestroy() {
    this.paymentsService.clearPaymentsTableState();
    // this.paymentsService.clearGlobalDataState();
    this.paymentsService.refreshTablePageIndex();
    this.subscription$.next();
    this.subscription$.complete();
    console.log('GRID DESTROYED')
  }
  // to_camel_case(str) {
  //   var regExp = /[-_]\w/ig;
  //   console.log('TEST',str.replace(regExp, function (match) {
  //     return match.charAt(1).toUpperCase();
  //   }))
  // }
  // var newText = text.replace(/[_-]/g, " ")
  // .split(' ')
  // .map((data) => {
  //   if (data.charAt(0) === data.charAt(0).toUpperCase()) {
  //     data = data;
  //   }
  //   if(text.indexOf(data) !== 0 ){
  //     data = data.charAt(0).toUpperCase() + data.substring(1);
  //   }      
  //   return data;
  // }).join('')
  // console.log('TEST', newText)

}

