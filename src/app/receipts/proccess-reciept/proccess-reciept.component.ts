import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { Component, OnInit, Input, OnChanges, ElementRef, ViewChild, NgZone } from '@angular/core';
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
  @Input() currentlyLang: string;
  customerNamesForReceipt: {};
  payByCreditCard: boolean;
  receiptForList: object[] = [];
  customerName: string;
  proccessReceipt: FormGroup;
  sendReceiptTo = 'email';
  thanksLetters: any[];
  requirdEmailOrPhone = true;
  totalAmount: number;
  selectedReceipt: object;
  selectedReceiptName: string;
  receiptsType: any[];
  currentlyLetters: any[];
  position;
  constructor(
    private receiptService: ReceiptsService,
    private dialog: MatDialog,
    private generalService: GeneralSrv,
    private fb: FormBuilder,
    private zone: NgZone
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
    // this.zone.runOutsideAngular(() => {
    //   // setInterval(() => {
    //     if (this.currentlyLang === 'he') {
    //        this.position = {
    //        'text-right': true,
    //       };
    //     } else {
    //       this.position = {
    //         'text-left': true,
    //       };
    //     }
    //   // }, 1);
    // });
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
    this.generalService.receiptData.subscribe(data => {
      this.receiptsType = data['ReceiptTypes'];

    });
    this.receiptService.currentlyName.subscribe(name => {
      this.customerName = name;
    });
    this.receiptService.currentlyAmount.subscribe(amount => {
      this.totalAmount = amount;
    });
    this.receiptService.checkSelectedRecType.subscribe(() => {
      this.getSelectedReceiptType();
    });
    this.getReceiptForList();
    this.checkValueChangesSendTo();
    this.checkValueChangesCustomerName();
  }
  getReceiptForList() {
    this.generalService.receiptData.subscribe(data => {
      this.receiptForList = data['Receipt_For_List'];
      console.log(this.receiptForList);
    })
  }
  getReceiptThanksLetters(receiptId) {
    const id = this.changeThankLetterForCredirType(receiptId);
    this.generalService.receiptData.subscribe(data => {
      this.thanksLetters = data['ReceiptThanksLetter'];
      this.currentlyLetters = this.thanksLetters.filter(receipt => receipt.ReceiptId === id);

    });
  }
  changeThankLetterForCredirType(receiptId) {
    let id;
    for (const receipt of this.receiptsType) {
      if (receipt.ReceiptCancelID === receiptId) {
        receiptId = receipt.RecieptTypeId;
        console.log(receiptId);
        break;
      }
    }
    id = receiptId;
    return id;
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
this.receiptService.setStep(1)
  }
  test(test) {
    console.log(test)
    // console.log(this.sendReceiptTo)
  }
  getSelectedReceiptType() {
    this.selectedReceipt = this.receiptService.selReceiptType;
    this.selectedReceiptName = this.selectedReceipt['RecieptName'];
    this.getReceiptThanksLetters(this.selectedReceipt['RecieptTypeId']);
    console.log('this.selectedReceipt', this.selectedReceiptName);
  }
  changePosition() {
    return this.generalService.changePositionElement();
  }
}

