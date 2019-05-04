import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-proccess-reciept',
  templateUrl: './proccess-reciept.component.html',
  styleUrls: ['./proccess-reciept.component.css']
})
export class ProccessRecieptComponent implements OnInit, OnChanges {
  @Input() customerInfo: object;
  customerNamesForReceipt: {};
  payByCreditCard: boolean;
  receiptForList: object[] = [];
  customerName: string;
  proccessReceipt: FormGroup;
  constructor(
    private receiptService: ReceiptsService,
    private dialog: MatDialog,
    private GeneralSerice: GeneralSrv,
    private fb: FormBuilder
  ) {
    this.customerName = this.receiptService.newReceipt.customerInfo['firstName'] + this.receiptService.newReceipt.customerInfo['lastName'];
  }
  ngOnChanges() {
    if (typeof (this.customerInfo) != 'undefined' && this.customerInfo) {
      this.customerNamesForReceipt = this.customerInfo['CustomerNames4Receipt'];
      console.log('proccess', this.customerNamesForReceipt);
    }
  
  }
  ngOnInit() {
    this.proccessReceipt = this.fb.group({
      totalPayAmount: [''],
      customerName: [this.customerName],
      receipFor: [''],
      adress: [''],
      receiptTemplate: [''],
      textarea: [''],
      sendToEmail: [true],
      email: [''],
      showOnScreen: [true]
    });
    this.getReceiptForList();
    this.proccessReceipt.valueChanges.subscribe(data => console.log(data));
  }
  getReceiptForList() {
    this.GeneralSerice.receiptData.subscribe(data => {
      this.receiptForList = data['Receipt_For_List'];
      console.log(this.receiptForList);
    })
  }

}
