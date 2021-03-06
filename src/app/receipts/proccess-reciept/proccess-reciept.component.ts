import { CustomerGroupsService } from './../../core/services/customer-groups.service';
import { Addresses } from 'src/app/models/addresses.model';
import { CustomerInfoService } from 'src/app/shared/share-components/customer-info/customer-info.service';
import { CreditCardService } from './../credit-card/credit-card.service';
import { LastSelection } from './../../models/lastSelection.model';
import { Emails } from './../../models/emails.model';
import { FinalResolve } from 'src/app/models/finalResolve.model';
import { Component, OnInit, Input, OnChanges, NgZone, OnDestroy } from '@angular/core';
import { ReceiptsService } from 'src/app/shared/services/receipts.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription, Subject } from 'rxjs';
import { startWith, map, takeUntil, filter } from 'rxjs/operators';
import { GeneralSrv } from 'src/app/shared/services/GeneralSrv.service';
import { ReceiptHeader } from 'src/app/models/receiptHeader.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-proccess-reciept',
  templateUrl: './proccess-reciept.component.html',
  styleUrls: ['./proccess-reciept.component.css']
})
export class ProccessRecieptComponent implements OnInit, OnChanges, OnDestroy {
  @Input() customerInfo: object;
  @Input() currentLang: string;
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
  requiredEmail = true;
  requiredPhone = false;
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
  customerEmails: Emails[] = [];
  customerAddresses: Addresses[] = [];
  unsubscribe$: Subject<boolean> = new Subject();
  proccessReceiptIsInvalid$: Observable<boolean>;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private receiptService: ReceiptsService,
    private dialog: MatDialog,
    private generalService: GeneralSrv,
    private fb: FormBuilder,
    private zone: NgZone,
    private toaster: ToastrService,
    private router: Router,
    private creditCardService: CreditCardService,
    private spinner: NgxUiLoaderService,
    private customerInfoService: CustomerInfoService,
    private customerGroupsService: CustomerGroupsService
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
    //     if (this.currentLang === 'he') {
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
  ngOnInit() {
    console.log(this.customerInfo, 'CUSTOMER INFO TEST')

    this.subscriptions.add(this.receiptService.currentStep$.subscribe(step => this.step = step));
    this.subscriptions.add(this.receiptService.currentNewCustomer$.subscribe((customerStatus: boolean) => {
      this.newCustomer = customerStatus;
    }));
    this.generalService.currentLang$
    .pipe(
      takeUntil(this.unsubscribe$))
    .subscribe((lang: string) => this.currentLang = lang);
    this.createProcessReceiptForm();
    this.subscriptions.add(this.receiptService.getGlobalReceiptData$().subscribe(data => {
      this.receiptsType = data['ReceiptTypes'];

    }));
    this.getCustomerAddressForReceipt();
    this.getCustomerEmails();
    this.subscriptions.add(this.receiptService.currentFullName$.subscribe(name => {
      this.customerName = name;
      this.receiptName.patchValue(this.customerName);
    }));

    this.compareStoreAndTotalAmount();
    // this.getEmails()
    this.proccessReceiptIsInvalid$ = this.proccessReceipt.statusChanges;
    // .subscribe(status => {
    //    = status
    //   console.log('STATUS', status)
    // });
    // .pipe(takeUntil(this.unsubscribe$)).subscribe((data: Emails[]) => {
    //   this.customerEmails = data
    //   this.sendToEmail.patchValue(this.customerEmails[0].email);
    // });
    // .subscribe((emails: Emails[]) => {
    //   if (emails.length === 0) {
    //   } else {
    //     this.sendToEmail.patchValue(emails);
    //   }
    // }));

    this.subscriptions.add(this.receiptService.currentNameOfPaymentFor$.subscribe(
      (nameOfPaymentFor: string) => {
        this.receiptFor.patchValue(nameOfPaymentFor);
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

  getCustomerEmails() {
    this.receiptService.currentCustomerEmails$
      .pipe(
        filter(emails => emails !== null),
        takeUntil(this.unsubscribe$))
      .subscribe((emails: Emails[]) => {
        this.customerEmails = emails;
        if (this.customerEmails.length !== 0) {
          this.sendToEmail.patchValue(this.customerEmails[0].email);
        } else {
          this.sendToEmail.patchValue('');
        }

      })
    // console.log('EMAILS OBSERVBLE', this.customerEmails$)

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
      sendToEmail: ['', Validators.required,],
      sendToPhone: [''],
      showOnScreen: [true]
    });
    this.getLastSelection();
  }
  getLastSelection() {
    this.subscriptions.add(this.generalService.currentLastSelect$.subscribe((lastSelect: LastSelection) => {
      if (this.currentlyLetters.length > 0) {
        for (const letter of this.currentlyLetters) {
          if (letter.ThanksLetterId === lastSelect.receiptTemplate) {
            this.receiptTemplate.patchValue(lastSelect.receiptTemplate);
            break;
          } else {
            this.receiptTemplate.patchValue('');
          }
        }
      } else {
        this.receiptTemplate.patchValue('');
      }
    }));
  }
  get totalPayAmount() {
    return this.proccessReceipt.get('totalPayAmount');
  }
  get receiptName() {
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
  compareStoreAndTotalAmount() {
    this.subscriptions.add(this.receiptService.currentAmount$.subscribe(amount => {
      this.totalAmount = amount;
      this.proccessReceipt.get('totalPayAmount').patchValue(amount);
      if (this.currentlyStoreAmount > this.totalAmount) {
        this.amountError = true;
      } else {
        this.amountError = false;
      }
    }));
  }

  filterOptionReceiptFor() {
    this.filteredOptions = this.proccessReceipt.controls.receiptFor.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    console.log('this.filteredOptions', this.filteredOptions);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.receiptForList.filter(receipt => receipt['note'].toLowerCase().includes(filterValue));
  }

  getReceiptForList() {
    this.subscriptions.add(this.receiptService.getGlobalReceiptData$().subscribe(data => {
      this.receiptForList = data['Receipt_For_List'];
      console.log(this.receiptForList);
    }));
  }

  getReceiptThanksLetters(receiptId) {
    const id = this.changeThankLetterForCredirType(receiptId);
    this.subscriptions.add(this.receiptService.getGlobalReceiptData$().subscribe(data => {
      this.thanksLetters = data['ReceiptThanksLetter'];

      this.currentlyLetters = this.thanksLetters.filter(receipt => receipt.ReceiptId === id);
      this.getLastSelection();
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
        this.sendToEmail.patchValue('');
        this.sendToEmail.clearValidators();
        this.sendToEmail.updateValueAndValidity();
      } else if (this.sendReceiptTo === 'email') {
        this.sendToEmail.setValidators(Validators.required);
        this.sendToEmail.updateValueAndValidity();
      } else {
        this.sendToEmail.patchValue('');
        this.sendToEmail.clearValidators();
        this.sendToEmail.updateValueAndValidity();
      }
      console.log('SEND TO', data)
      console.log('this.requiredPhone', this.requiredPhone, 'this.requiredEmail', this.requiredEmail);
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
  }
  changePosition() {
    return this.generalService.changePositionElement();
  }

  addProccessReceiptToReceipt() {
    if (this.receiptTemplate.value === null || this.receiptTemplate.value === '') {
      const message = this.currentLang === 'he' ? 'בחר מכתב תודה' : 'Please select a thanks letter';
      this.toaster.warning('', message, {
        positionClass: 'toast-top-center'
      });
    } else if (this.amountError === false) {
      const newReceiptHeader: ReceiptHeader = this.receiptService.getReceiptHeader();
      newReceiptHeader.SendByEmailTo = this.sendToEmail.value;
      newReceiptHeader.ThanksLetterId = this.receiptTemplate.value;
      newReceiptHeader.WhatFor = this.receiptFor.value;
      this.receiptService.setTotalAmount(+this.totalAmount);
      console.log(this.receiptService.newReceipt);
      const newReceipt = this.receiptService.getFullNewReceipt();
      console.log(JSON.stringify(newReceipt));
      this.spinner.start();
      this.subscriptions.add(this.generalService.sendFullReceiptToServer(newReceipt).subscribe((res: FinalResolve) => {
        res = res['Data'];
        if (res.error === 'true') {
          // this.receiptService.refreshNewReceipt();
          this.toaster.error('Please contact customer support', `Something went wrong ${res.moreinfo}`, {
            positionClass: 'toast-top-center'
          });
          this.spinner.stop();
          console.log('ERROR', this.receiptService.newReceipt, res);
        } else {
          const message = this.currentLang === 'he' ? 'עסקה בוצעה בהצלחה' : 'Transaction successfully completed';
          this.receiptService.refreshNewReceipt();
          this.toaster.success('', message, {
            positionClass: 'toast-top-center'
          });
          this.generalService.setItemToLastSelection('receiptFor', this.receiptFor.value);
          this.generalService.setItemToLastSelection('receiptTemplate', this.receiptTemplate.value);
          this.generalService.saveLastSelection();
          this.customerInfoService.createNewClicked();
          this.creditCardService.credCardIsVerified.next(false);
          this.receiptService.nextStep();
          this.finalResolve = res;
          // this.receiptService.refreshNewReceipt();
          this.spinner.stop();
          this.customerInfoService.clearCurrentCustomerInfoByIdForCustomerInfoComponent();
          this.customerGroupsService.clearSelectedGroups();
          console.log('Success', res);
        }
      }));
    } else {
      const message = this.currentLang === 'he' ? 'אנא שנה את הסכום' : 'Please change the amount';
      this.toaster.warning('', message, {
        positionClass: 'toast-top-center'
      });
    }

  }

  pickSuggestedName(name: string) {
    this.proccessReceipt.get('customerName').patchValue(name);
  }

  getStoreCurrentlyAmount() {
    this.subscriptions.add(this.receiptService.currentStoreAmount$.subscribe(data => {
      this.currentlyStoreAmount = data;
      console.log(this.currentlyStoreAmount);
    }));
  }

  createNewReceipt() {
    this.proccessReceipt.reset();
    this.showOnScreen.patchValue(true);
    this.receiptService.refreshNewReceipt();
    this.customerInfoService.createNewClicked();
    this.receiptService.setStep(1);
    this.sendTo.patchValue('email');
  }

  showReceiptTemplate() {
    window.open(this.finalResolve.link, '_blank');
    this.createNewReceipt();
  }



  getCustomerAddressForReceipt() {
    this.receiptService.currentAddress
      .pipe(
        map(addresses => addresses.map(address => {
          for (let item in address) {
            address[item] = address[item] === null ? '' : address[item];
          }
          return address
        })),
        takeUntil(this.unsubscribe$))
      .subscribe(address => {
        this.customerAddresses = address
        if (this.customerAddresses.length >= 1) {
          const selectedAddress = address[0].cityName + address[0].street + address[0].zip
          this.addressOnTheReceipt.patchValue(selectedAddress);
        } else {
          this.addressOnTheReceipt.patchValue('');
        }
      })


  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    console.log('PROCCESS SUBSCRIBE', this.subscriptions);
    this.subscriptions.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.log('TAKE UNTILE WORK', this.receiptService.currentCustomerEmails$)
    console.log('PROCCESS SUBSCRIBE On Destroy', this.receiptService.getGlobalReceiptData$());
  }
}

