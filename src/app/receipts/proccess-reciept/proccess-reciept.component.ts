import { FinalResolve } from 'src/app/models/finalResolve.model';
import { ModalFinalScreenComponent } from './../modals/modal-final-screen/modal-final-screen.component';
import { Component, OnInit, Input, OnChanges, ElementRef, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { ReceiptHeader } from 'src/app/models/receiptHeader.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proccess-reciept',
  templateUrl: './proccess-reciept.component.html',
  styleUrls: ['./proccess-reciept.component.css']
})
export class ProccessRecieptComponent implements OnInit, OnChanges, OnDestroy {
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
  finalResolve: FinalResolve;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private receiptService: ReceiptsService,
    private dialog: MatDialog,
    private generalService: GeneralSrv,
    private fb: FormBuilder,
    private zone: NgZone,
    private toaster: ToastrService,
    private router: Router
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
    this.subscriptions.add(this.receiptService.currentlyStep.subscribe(step => this.step = step));
    this.subscriptions.add(this.receiptService.currentlyNewCustomer.subscribe((customerStatus: boolean) => {
      this.newCustomer = customerStatus;
      if (this.newCustomer === false) {
        this.proccessReceipt.get('customerName').patchValue(this.listOfCustomersName[0]);
      }
    }));
    this.createProcessReceiptForm();
    this.subscriptions.add(this.generalService.receiptData.subscribe(data => {
      this.receiptsType = data['ReceiptTypes'];

    }));
    this.subscriptions.add(this.receiptService.currentlyName.subscribe(name => {
      this.customerName = name;
      if (this.newCustomer === true) {
        this.proccessReceipt.get('customerName').patchValue(this.customerName);

      }
    }));
    this.subscriptions.add(this.receiptService.currentlyAmount.subscribe(amount => {
      this.totalAmount = amount;
      this.proccessReceipt.get('totalPayAmount').patchValue(amount);
      if (this.currentlyStoreAmount > this.totalAmount) {
        this.amountError = true;
      } else {
        this.amountError = false;
      }
    }));
    this.subscriptions.add(this.receiptService.checkSelectedRecType.subscribe(() => {
      this.getSelectedReceiptType();
    }));
    this.getStoreCurrentlyAmount();
    this.getReceiptForList();
    this.checkValueChangesSendTo();
    this.checkValueChangesCustomerName();
    this.filterOptionReceiptFor();
    this.filterOptionNameForReceipt();
  }
  createProcessReceiptForm() {
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
  }
  get totalPayAmount() {
    return this.proccessReceipt.get('totalPayAmount');
  }
  get totalcustomerNamePayAmount() {
    return this.proccessReceipt.get('customerName');
  }
  get receiptFor() {
    return this.proccessReceipt.get('receiptFor');
  }
  get addressOnTheReceipt() {
    return this.proccessReceipt.get('addressOnTheReceipt');
  }
  get receiptTemplate() {
    return this.proccessReceipt.get('receiptTemplate');
  }
  get sendTo() {
    return this.proccessReceipt.get('sendTo');
  }
  get sendToEmail() {
    return this.proccessReceipt.get('sendToEmail');
  }
  get sendToPhone() {
    return this.proccessReceipt.get('sendToPhone');
  }
  get showOnScreen() {
    return this.proccessReceipt.get('showOnScreen');
  }
  filterOptionNameForReceipt() {
    this.filteredlistOfCustomersName = this.proccessReceipt.controls.customerName.valueChanges
      .pipe(
        startWith(''),
        map(value => this.namefilter(value))
      );
  }
  private namefilter(value: string): string[] {
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
    this.subscriptions.add(this.generalService.receiptData.subscribe(data => {
      this.receiptForList = data['Receipt_For_List'];
      console.log(this.receiptForList);
    }));
  }
  getReceiptThanksLetters(receiptId) {
    const id = this.changeThankLetterForCredirType(receiptId);
    this.subscriptions.add(this.generalService.receiptData.subscribe(data => {
      this.thanksLetters = data['ReceiptThanksLetter'];

      this.currentlyLetters = this.thanksLetters.filter(receipt => receipt.ReceiptId === id);
      console.log('this.currentlyLetters', this.currentlyLetters)
    }));
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
    this.subscriptions.add(sendTo.valueChanges.subscribe(data => {
      this.sendReceiptTo = data;
      if (this.sendReceiptTo === 'dontSend') {
        this.requirdEmailOrPhone = false;
      } else {
        this.requirdEmailOrPhone = true;
      }
      console.log(this.requirdEmailOrPhone)
    }));
  }
  /**
   * Check some changes in form control 'customerName'
   */
  checkValueChangesCustomerName() {
    const sendTo = this.proccessReceipt.get('customerName');
    this.subscriptions.add(sendTo.valueChanges.subscribe(data => {
      this.customerName = data;
    }));
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

  addProccessReceiptToReceipt() {
    if (this.receiptTemplate.value === null || this.receiptTemplate.value === '') {
      this.toaster.warning('', 'Please select a thanks letter', {
        positionClass: 'toast-top-center'
      });
    } else {
      const newReceiptHeader: ReceiptHeader = this.receiptService.getReceiptHeader();
      newReceiptHeader.SendByEmailTo = this.sendToEmail.value;
      newReceiptHeader.ThanksLetterId = this.receiptTemplate.value;
      newReceiptHeader.WhatFor = this.receiptFor.value;
      // this.receiptService.setReceiptHeaderItems('FileAs', 'fileAs');
      // this.receiptService.setReceiptHeaderItems('fname', 'firstName');
      // this.receiptService.setReceiptHeaderItems('lname', 'lastName');
      // this.receiptService.setReceiptHeaderItems('Company', 'company');
      // this.receiptService.setReceiptHeaderItems('Titel', 'title');
      // this.receiptService.setReceiptHeaderItems('CustomerCode', 'tZ');
      // this.receiptService.setReceiptHeaderItems('Zip', 'zip');
      // this.receiptService.setReceiptHeaderItems('CityName', 'city');
      // this.receiptService.setReceiptHeaderItems('Street', 'street');
      this.receiptService.setTotalAmount(+this.totalAmount);
      console.log(this.receiptService.newReceipt);
      const newReceipt = this.receiptService.getFullNewReceipt();
      console.log(JSON.stringify(newReceipt));
      this.subscriptions.add(this.generalService.sendFullReceiptToServer(newReceipt).subscribe((res: FinalResolve) => {
        res = res['Data'];
        if (res.error === 'true') {
          // this.receiptService.refreshNewReceipt();
          this.toaster.error('Please contact customer support', `Something went wrong ${res.moreinfo}`, {
            positionClass: 'toast-top-center'
          });
          console.log(this.receiptService.newReceipt, res);
        } else {
          const message = this.currentlyLang === 'he' ? 'עסקה בוצעה בהצלחה' : 'Transaction successfully completed';
          this.receiptService.refreshNewReceipt();
          this.toaster.success('', message, {
            positionClass: 'toast-top-center'
          });
          this.receiptService.nextStep();
          this.finalResolve = res;
          // this.receiptService.refreshNewReceipt();
          console.log('ERROR', res);
        }
      }));

    }

  }
  pickSuggestedName(name: string) {
    this.proccessReceipt.get('customerName').patchValue(name);
  }
  getStoreCurrentlyAmount() {
    this.subscriptions.add(this.receiptService.currentlyStoreAmount.subscribe(data => {
      this.currentlyStoreAmount = data;
      console.log(this.currentlyStoreAmount);
    }));
  }
  createNewReceipt() {
    this.receiptService.refreshNewReceipt();
    this.receiptService.createNewEvent.next();
    this.receiptService.setStep(1);
  }
  showReceiptTemplate() {
// tslint:disable-next-line: max-line-length
    window.open('http://createpays.amax.co.il/CreatesessionReceipt.aspx?oid=5256e46f-2bd7-4c6a-9d5b-11f4263b27d9&orgid=153&orgname=jaffanet1&RecieptType=10&Currency=NIS&forprint=1', '_blank');
    // this.router.navigateByUrl('http://createpays.amax.co.il/CreatesessionReceipt.aspx?oid=5256e46f-2bd7-4c6a-9d5b-11f4263b27d9&orgid=153&orgname=jaffanet1&RecieptType=10&Currency=NIS&forprint=1');
    this.receiptService.createNewEvent.next();
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    console.log('PROCCESS SUBSCRIBE', this.subscriptions);
    this.subscriptions.unsubscribe();
    console.log('PROCCESS SUBSCRIBE On Destroy', this.subscriptions);
  }
}

