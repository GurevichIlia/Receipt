import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ReceiptsService } from '../../services/receipts.service';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { MatRadioChange } from '@angular/material';

@Component({
  selector: 'app-receipt-type',
  templateUrl: './receipt-type.component.html',
  styleUrls: ['./receipt-type.component.css']
})
export class ReceiptTypeComponent implements OnInit {
  @Output() changeValue: EventEmitter<MatRadioChange>;
  receiptTypes: any[] = [{ RecieptTypeId: 0, RecieptName: '' }];
  newReceiptTypes: any[];
  organisations: any[] = [];
  receiptType = '0';
  selected_receiptIsForDonation = true;
  selected_receiptCreditOrDebit = false;
  selectedOrg = 1;
  selectedReceiptType = null;
  selectOptForReceiptType = {};
  receiptCurrencyId: string;
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv
  ) { }

  ngOnInit() {
    this.getReceiptsData()
  }
  getReceiptsData() {
    this.generalService.getReceiptshData().subscribe(data => {
      console.log('Receipt Data', data);
      this.generalService.fullReceiptData.next(data);
      this.receiptTypes = data.ReceiptTypes;
      this.organisations = data.Orgs;
      this.filterRecType();
    });
  }
  filterRecType() {
    try {
      this.newReceiptTypes = Object.assign(
        [],
        this.receiptTypes
      );
      this.newReceiptTypes = this.newReceiptTypes.filter(
        e =>
          e.DonationReceipt === this.selected_receiptIsForDonation &&
          e.UseAsCreditReceipt === this.selected_receiptCreditOrDebit &&
          e.orgid === this.selectedOrg
      );
      // this.receiptType = this.receiptTypes[0].RecieptTypeId;
      this.selectedReceiptType = null;
      console.log('selectRecType', this.newReceiptTypes)
    } catch (e) {
      console.log(e);
    }
  }
  radButChanged() {
    this.filterRecType();
  }
  showRecieptTypeId() {
    this.receiptService.selectedReceiptType = this.selectedReceiptType;
    console.log(this.selectedReceiptType);
  }
  addPaymentTypeToReceipt() {
    this.selectOptForReceiptType = {
      orgName: this.selectedOrg,
      receiptForDonat: this.selected_receiptIsForDonation,
      receiptCredit: this.selected_receiptCreditOrDebit,
      receiptTypeId: this.selectedReceiptType.RecieptTypeId,
      receiptCurrencyId: this.selectedReceiptType.CurrencyId
    }
    this.receiptService.selReceiptCurrencyId.next(this.selectedReceiptType.CurrencyId);
    this.receiptService.newReceipt.receiptType = this.selectOptForReceiptType;
    this.receiptService.checkSelectedRecType.next();
    console.log(this.receiptService.newReceipt);
  }
}
