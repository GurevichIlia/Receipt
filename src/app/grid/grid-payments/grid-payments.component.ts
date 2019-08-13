import { CreditCardList } from './../../models/creditCardList.model';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { PaymentsService } from './../payments.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-grid-payments',
  templateUrl: './grid-payments.component.html',
  styleUrls: ['./grid-payments.component.css']
})
export class GridPaymentsComponent implements OnInit {

  constructor(
    private paymentsService: PaymentsService,
    private generalService: GeneralSrv
  ) { }

  ngOnInit() {
    this.getCustomerCreditCardList();
  }
  getCustomerCreditCardList() {
    this.paymentsService.getCustomerCreditCardListData(this.generalService.orgName)
      .subscribe((data: CreditCardList[]) => this.paymentsService.setCreditCardList(data)),
      error => console.log(error);
  }


}
