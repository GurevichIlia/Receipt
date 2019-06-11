import { ModalFinalScreenComponent } from './../modals/modal-final-screen/modal-final-screen.component';
import { Component, OnInit, Input, OnChanges, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { ReceiptHeader } from 'src/app/models/receiptHeader.model';

@Component({
  selector: 'app-proccess-reciept',
  templateUrl: './proccess-reciept.component.html',
  styleUrls: ['./proccess-reciept.component.css']
})
export class ProccessRecieptComponent implements OnInit, OnChanges {
  @Input() customerInfo: object;
  @Input() currentlyLang: string;
  @Input() nameFilter: any[];
  step: number;
  filteredOptions: Observable<any[]>;
  filteredlistOfCustomersName: Observable<any[]>;
  customerNamesForReceipt: any[] = [];
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
  currentlyLetters: any[] = [];
  position;
  listOfCustomersName: any[] = [];
  newCustomer: boolean;
  currentlyStoreAmount = 0;
  amountError = false;
  constructor(
    private receiptService: ReceiptsService,
    private dialog: MatDialog,
    private generalService: GeneralSrv,
    private fb: FormBuilder,
    private zone: NgZone
  ) {
  }
  ngOnChanges() {
    if (typeof (this.customerInfo) != 'undefined' && this.customerInfo) {
      this.customerNamesForReceipt = this.customerInfo['CustomerNames4Receipt'] as [];
      for (const customer of this.customerNamesForReceipt) {
        console.log(Object.values(customer));
        this.listOfCustomersName = Object.values(customer).filter(data => String(data).length > 0);
        console.log(this.listOfCustomersName);
      }
      console.log('Customer', this.customerInfo);
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
    // console.log('FILTER', this.nameFilter)
    // console.log('FILTER', this.nameFilter)
  }
  getCustomerNameList() {

  }
  ngOnInit() {
    this.receiptService.currentlyStep.subscribe(step => this.step = step);
    this.receiptService.currentlyNewCustomer.subscribe((customerStatus: boolean) => {
      this.newCustomer = customerStatus;
      if (this.newCustomer === false) {
        this.proccessReceipt.get('customerName').patchValue(this.listOfCustomersName[0]);
      }
    });
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
      if (this.newCustomer === true) {
        this.proccessReceipt.get('customerName').patchValue(this.customerName);

      }
    });
    this.receiptService.currentlyAmount.subscribe(amount => {
      this.totalAmount = amount;
      this.proccessReceipt.get('totalPayAmount').patchValue(amount);
      if (this.currentlyStoreAmount > this.totalAmount) {
        this.amountError = true;
      } else {
        this.amountError = false;
      }
    });
    this.receiptService.checkSelectedRecType.subscribe(() => {
      this.getSelectedReceiptType();
    });
    this.getStoreCurrentlyAmount();
    this.getReceiptForList();
    this.checkValueChangesSendTo();
    this.checkValueChangesCustomerName();
    this.filterOptionReceiptFor();
    this.filterOptionNameForReceipt();
  }
  filterOptionNameForReceipt() {
    this.filteredlistOfCustomersName = this.proccessReceipt.controls.customerName.valueChanges
      .pipe(
        startWith(''),
        map(value => this.namefilter(value))
      );
  }
  private namefilter(value: string): string[] {
    debugger;
    const filterValue = value.toLowerCase();
    return this.listOfCustomersName.filter(name => name.toLowerCase().includes(filterValue));
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
      console.log('this.currentlyLetters', this.currentlyLetters)
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

  addProccessReceiptToReceipt(form: FormGroup) {
    const newReceiptHeader: ReceiptHeader = this.receiptService.newReceipt.Receipt.ReceiptHeader;
    newReceiptHeader.SendByEmailTo = form.get('sendToEmail').value;
    newReceiptHeader.ThanksLetterId = form.get('receiptTemplate').value;
    newReceiptHeader.WhatFor = form.get('receiptFor').value;
    this.receiptService.setReceiptHeaderItems('FileAs', 'fileAs');
    this.receiptService.setReceiptHeaderItems('fname', 'firstName');
    this.receiptService.setReceiptHeaderItems('lname', 'lastName');
    this.receiptService.setReceiptHeaderItems('Company', 'company');
    this.receiptService.setReceiptHeaderItems('Titel', 'title');
    this.receiptService.setReceiptHeaderItems('CustomerCode', 'tZ');
    this.receiptService.setReceiptHeaderItems('Zip', 'zip');
    this.receiptService.setReceiptHeaderItems('CityName', 'city');
    this.receiptService.setReceiptHeaderItems('Street', 'street');
    this.receiptService.setTotalAmount(+this.totalAmount);
    console.log(this.receiptService.newReceipt);
    console.log(JSON.stringify(this.receiptService.newReceipt));
    console.log(this.receiptService.getFullNewReceipt());
    this.generalService.sendFullReceiptToServer(this.receiptService.getFullNewReceipt()).subscribe(res => {
      if (res['Data'] === 'ok') {
        // this.receiptService.refreshNewReceipt();
        this.dialog.open(ModalFinalScreenComponent, {
          data: { resolve: res['Data'].res, res_description: res['Data'].res_description }
        });
        console.log(this.receiptService.newReceipt, res);
      } else {
        this.dialog.open(ModalFinalScreenComponent, {
          data: { resolve: res['Data'].res, res_description: res['Data'].res_description }
        });;
        // this.receiptService.refreshNewReceipt();
        console.log('ERROR', res);
      }
    });
  }
  pickSuggestedName(name: string) {
    this.proccessReceipt.get('customerName').patchValue(name);
  }
  getStoreCurrentlyAmount() {
    this.receiptService.currentlyStoreAmount.subscribe(data => {
      this.currentlyStoreAmount = data;
      console.log(this.currentlyStoreAmount);
    });
  }
}

