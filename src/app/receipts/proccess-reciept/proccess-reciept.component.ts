import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { Component, OnInit, Input, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

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
  sendReceiptTo = 'email';
  thanksLetters: any[];
  requirdEmailOrPhone = true;
  totalAmount: number;
  selectedReceiptName: string;
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
      this.customerNamesForReceipt = Object.assign({}, this.customerInfo['CustomerNames4Receipt']);
      console.log('Customer', this.customerInfo)
      console.log('proccess', this.customerNamesForReceipt);
      this.customerName = this.proccessReceipt.controls.customerName.value;
    }
  }
  ngOnInit() {
    this.proccessReceipt = this.fb.group({
      totalPayAmount: [''],
      customerName: [''],
      receipFor: [''],
      addressOnTheReceipt: [''],
      receiptTemplate: [''],
      textarea: [''],
      sendTo: [this.sendReceiptTo],
      sendToEmail: [''],
      sendToPhone: [''],
      showOnScreen: [true]
    });
    this.receiptService.currentlyName.subscribe(name => {
      this.customerName = name;
    });
    this.receiptService.currentlyAmount.subscribe(amount => {
      this.totalAmount = amount;
    });
    this.receiptService.checkSelectedRecType.subscribe(() => {
      this.getSelectedReceiptType();
    })
    this.getReceiptForList();
    this.getReceiptThanksLetters();
    this.checkValueChangesSendTo();
    this.checkValueChangesCustomerName();
  }
  getReceiptForList() {
    this.GeneralSerice.receiptData.subscribe(data => {
      this.receiptForList = data['Receipt_For_List'];
      console.log(this.receiptForList);
    })
  }
  getReceiptThanksLetters() {
    this.GeneralSerice.receiptData.subscribe(data => {
      this.thanksLetters = data['ReceiptThanksLetter'];
      console.log(data['ReceiptThanksLetter']);
    });
  }
  /**
   * Check some changes in form control 'sendTo'
   */
  checkValueChangesSendTo() {
    const sendTo = this.proccessReceipt.get('sendTo');
    sendTo.valueChanges.subscribe(data => {
      this.sendReceiptTo = data;
      if (this.sendReceiptTo === 'dontSend') {
        this.requirdEmailOrPhone = false;
      } else {
        this.requirdEmailOrPhone = true;
      }
      console.log(this.requirdEmailOrPhone)
    });
  }
  /**
   * Check some changes in form control 'customerName'
   */
  checkValueChangesCustomerName() {
    const sendTo = this.proccessReceipt.get('customerName');
    sendTo.valueChanges.subscribe(data => {
      this.customerName = data;
    });
  }
  addProccessReceiptToReceipt(form: FormGroup) {
    this.receiptService.newReceipt.proccessReceip = form.value;
  }
  createNewReceipt() {

  }
  test(test) {
    console.log(test)
    // console.log(this.sendReceiptTo)
  }
  getSelectedReceiptType() {
    this.selectedReceiptName = this.receiptService.receiptType['RecieptName'];
    console.log('this.selectedReceipt', this.selectedReceiptName);
  }
}
