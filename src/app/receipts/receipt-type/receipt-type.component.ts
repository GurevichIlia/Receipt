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
      this.selectRecType();
    });
  }
  selectRecType() {
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
      console.log('selectRecType', this.newReceiptTypes)
    } catch (e) {
      console.log(e);
    }
  }
  radButChanged() {
    this.selectRecType();
  }
  showRecieptTypeId(RecieptTypeId) {
    console.log(RecieptTypeId)
  }
}
