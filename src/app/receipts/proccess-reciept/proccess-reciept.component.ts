import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { Component, OnInit, Input, OnChanges, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-proccess-reciept',
  templateUrl: './proccess-reciept.component.html',
  styleUrls: ['./proccess-reciept.component.css']
})
export class ProccessRecieptComponent implements OnInit, OnChanges {
  @Input() customerInfo: object;
  @Input() currentlyLang: string;
  step: number;
  filteredOptions: Observable<any[]>;
  customerNamesForReceipt: {};
  payByCreditCard: boolean;
  receiptForList: any[] = [];
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
    // this.customerName = this.receiptService.newReceipt.customerInfo['firstName'] + this.receiptService.newReceipt.customerInfo['lastName'];

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
    this.receiptService.currentlyStep.subscribe(step => this.step = step);

    this.proccessReceipt = this.fb.group({
      totalPayAmount: [''],
      customerName: [''],
      receiptFor: [''],
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
    this.filterOptionReceiptFor();
  }
  filterOptionReceiptFor() {
    this.filteredOptions = this.proccessReceipt.controls.receiptFor.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.receiptForList.filter(receipt => receipt['note'].toLowerCase().includes(filterValue));
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
  createNewReceipt() {
    this.receiptService.setStep(1);
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
  addReceiptHeader() {
    this.receiptService.newReceipt.Receipt.ReceiptHeader.fname = this.receiptService.newReceipt.customerInfo.customermaininfo.firstName;
    this.receiptService.newReceipt.Receipt.ReceiptHeader.lname = this.receiptService.newReceipt.customerInfo.customermaininfo.lastName;
    // this.receiptService.newReceipt.Receipt.ReceiptHeader.CityName;
    this.receiptService.newReceipt.Receipt.ReceiptHeader.Company = this.receiptService.newReceipt.customerInfo.customermaininfo.company;
    // this.receiptService.newReceipt.Receipt.ReceiptHeader.CountryCode = this.receiptService.newReceipt.customerInfo.customermaininfo.
    this.receiptService.newReceipt.Receipt.ReceiptHeader.FileAs = this.receiptService.newReceipt.customerInfo.customermaininfo.firstName;
    this.receiptService.newReceipt.Receipt.ReceiptHeader.Total = Number(this.totalAmount);
    this.receiptService.newReceipt.Receipt.ReceiptHeader.CustomerCode = this.receiptService.newReceipt.customerInfo.customermaininfo.tZ;
  }
  addProccessReceiptToReceipt(form: FormGroup) {
    console.log(form.value)
    this.receiptService.newReceipt.Receipt.ReceiptHeader.SendByEmailTo = form.get('sendToEmail').value;
    this.receiptService.newReceipt.Receipt.ReceiptHeader.ThanksLetterId = form.get('receiptTemplate').value;
    this.receiptService.newReceipt.Receipt.ReceiptHeader.WhatFor = form.get('receiptFor').value;
    this.addReceiptHeader();
    // receiptService.nextStep()
    console.log(this.receiptService.newReceipt);
  }
}

