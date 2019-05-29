import { CreditCardService } from './../credit-card/credit-card.service';
import { Component, OnInit, ViewChild, ElementRef, OnChanges, Input, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import * as moment from 'moment';
import { NgForm, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, delay, debounceTime } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CreditCardComponent } from '../credit-card/credit-card.component';
import { Receiptlines } from 'src/app/models/receiptlines.model';
import { Creditcard } from 'src/app/models/creditCard.model';




@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, AfterViewInit {
  @Input() currentlyLang: string;
  step: number;
  // @ViewChild('TotalAmount') totAmount: ElementRef;
  paymentMethodId = null;
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  dueDate: string;
  paymentMethods: object[] = [];
  currencyTypes: object[] = [];
  donationTypes: object[] = [];
  accounts: object[] = [];
  projectsCategories: object[] = [];
  projects: object[] = [];
  banks: string[] = [];
  receiptLines: Receiptlines[] = [];
  receiptLine: Receiptlines;
  newCheckOrWire: object;
  // checksOrWires: any[] = [];
  paymentFor: number;
  accountId: number;
  project: number;
  currency: any;
  payment: {};
  payments: any[] = [];
  // totalAmount: number;
  payByCreditCard: FormGroup;
  totalAmount: number;
  creditCard: Creditcard;
  paymentGroup: FormGroup;
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private dialog: MatDialog,
    private credirCardService: CreditCardService,
    private fb: FormBuilder
  ) {
    this.dueDate = moment().format('YYYY-MM-DD');
    this.payment = {
      payTypeMethod: null,
      amount: null,
      currency: null,
      paymentFor: null,
      account: null,
      project: null,
      payAccount: '',
      dueDate: this.dueDate,
      bank: '',
      branch: '',
      checkNum: null
    };
    this.newCheckOrWire = {
      payAccount: '',
      dueDate: this.dueDate,
      bank: '',
      amount: '',
      branch: '',
      checkNum: null
    }
  }
  ngOnInit() {
    this.paymentGroup = this.fb.group({
      currency: [this.receiptService.selReceiptCurrencyId],
      paymentFor: [''],
      accountId: [null],

    })
    this.receiptService.currentlyStep.subscribe(step => this.step = step);
    this.payByCreditCard = this.fb.group({
      totalPayments: [null],
      firstPayment: [null],
      eachPayment: [null]
    });

    this.generalService.receiptData.subscribe(data => {
      this.paymentMethods = data['PaymentTypes'];
      this.currencyTypes = data['GetCurrencyTypes'];
      this.donationTypes = data['DonationTypes'];
      this.accounts = data['Accounts'];
      this.projectsCategories = data['ProjectsCategories'];
      this.projects = data['Projects4Receipts'];
      this.banks = data['Banks']
      console.log('payment', this.donationTypes);
    });
    this.receiptService.selectedPaymentMethod.subscribe(data => {
      this.paymentMethodId = data;
    })
    this.receiptService.selCurrencyId.subscribe(currencyId => {
      this.currency = currencyId;
    });
    this.filterOption();
    this.checkFieldsValue();

  }
  ngAfterViewInit() {

  }
  // checkPayType(payType: number) {
  //   if (payType === 3) {
  //     this.receiptService.payByCreditCard.next(true);
  //   } else {
  //     this.receiptService.payByCreditCard.next(false);
  //   }
  //   console.log(this.receiptService.payByCreditCard)
  // }

  checkFieldsValue() {
    const firstPayment = this.payByCreditCard.get('firstPayment');
    const totalPayments = this.payByCreditCard.get('totalPayments');
    firstPayment.valueChanges.pipe(
      debounceTime(1000))
      .subscribe(firstPayment => {
        console.log(firstPayment);
        if (firstPayment === null || firstPayment === '' || totalPayments.value === null) {
          this.payByCreditCard.controls.eachPayment.patchValue(null);
        } else {
          this.calculatePaymentsForCredCard();
        }
      });
    totalPayments.valueChanges.pipe(debounceTime(1000))
      .subscribe(totalPay => {
        console.log(totalPayments);
        if (totalPay === null || totalPay === '' || firstPayment.value === null) {
          this.payByCreditCard.controls.eachPayment.patchValue(null);
        } else {
          this.calculatePaymentsForCredCard();
        }
        // if (totalPayments !== null && firstPayment.value !== null) {
        //   this.calculatePaymentsForCredCard();
        // } if (totalPayments.value === null || firstPayment.value === null) {
        //   this.payByCreditCard.controls.eachPayment.patchValue(null);
        // }
      });
  }
  calculatePaymentsForCredCard() {
    const totalAmount = this.totalAmount;
    const totalPayments = this.payByCreditCard.get('totalPayments').value;
    const firstPayment = this.payByCreditCard.get('firstPayment').value;
    const newAmount = totalAmount - firstPayment;
    const eachPayment = newAmount / (totalPayments - 1);
    console.log('EACHPAY', eachPayment);
    if (eachPayment >= 0) {
      this.payByCreditCard.controls.eachPayment.patchValue(Number(eachPayment).toFixed(2));

    } else {
      alert('Add correct data')
    }

  }
  filterOption() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.banks.filter(bank => bank['BankNameEng'].toLowerCase().includes(filterValue));
  }
  addPaymentToList(payment: NgForm) {
    console.log('payment', payment.value)
    const amountRow = payment.value.amount;
    payment.value['dueDate'] = moment(payment.value['dueDate']).format('YYYY-MM-DD')
    // this.checksOrWires.push(payment.value);
    this.newCheckOrWire['dueDate'] = moment(payment.value['dueDate']).add(1, 'month').format('YYYY-MM-DD');
    this.newCheckOrWire['checkNum'] = this.newCheckOrWire['checkNum'] + 1;
    this.payment = {
      payTypeMethod: this.paymentMethodId,
      amount: payment.value.amount,
      currency: this.currency,
      dueDate: payment.value.dueDate,
      paymentFor: this.paymentFor,
      account: this.accountId,
      project: this.project,
      payAccount: payment.value.payAccount,
      bank: this.myControl.value,
      branch: payment.value.branch,
      checkNum: payment.value.checkNum
    };
    this.receiptLine = {
      ProjectId: this.project,
      PayTypeId: this.paymentMethodId,
      Amount: payment.value.amount,
      ValueDate: payment.value.dueDate,
      CheckNo: payment.value.checkNum,
      Bank: this.myControl.value,
      BranchNo: payment.value.branch,
      AccountNo: payment.value.payAccount,
      details: '',
      DonationTypeId: this.paymentFor,
      AccountId: this.accountId,
      AmountInLeadCurrent: payment.value.amount
    };
    console.log('this.receiptLine', this.receiptLine);
    this.payments.push(this.payment);
    this.receiptLines.push(this.receiptLine);
    this.showTotalAmount();
    this.checkPaymentsLength();
    console.log(this.payments);
    console.log(this.receiptLines)
  }
  deletePayment(payment) {
    console.log('payment', payment);
    this.payments = this.payments.filter(data => data !== payment);
    this.receiptLines = this.receiptLines.filter(data => data !== payment);
    console.log('this.payments', this.payments);
    this.showTotalAmount();
    this.checkPaymentsLength();

  }
  checkPaymentsLength() {
    if (this.payments.length === 0) {
      this.receiptService.blockPaymentMethod.next(false);
    } else {
      this.receiptService.blockPaymentMethod.next(true);
    }
  }
  showTotalAmount() {
    debugger;
    let totalPrice = 0;
    if(this.paymentMethodId === 3){
      this.receiptService.changeTotalAmount(this.totalAmount);
    } else {
      for (const amount of this.payments) {
        totalPrice += amount.amount;
      }
      this.totalAmount = totalPrice;
    this.receiptService.changeTotalAmount(totalPrice);
    }
  }
  addPaymentToReceipt() {
    if (this.paymentMethodId === 3) {
      this.addCreditCardPayToReceipt();
      this.receiptLines = [];
    } else {
      for (const check of this.receiptLines) {
        check.AmountInLeadCurrent = this.totalAmount;
      }
      this.receiptService.newReceipt.Receipt.recieptlines = this.receiptLines;
      this.receiptService.nextStep();
      console.log('addPaymentToReceipt', this.receiptService.newReceipt);
    }

    // this.payment = {
    //   payTypeMethod: this.paymentMethodId,
    //   amount: this.totalAmount,
    //   currency: this.currency,
    //   dueDate: moment(this.dueDate).format('YYYY-MM-DD'),
    //   paymentFor: this.paymentFor,
    //   account: this.accountId,
    //   project: this.project,
    // creditCard: this.credirCardService.verifiedCredCard
    // };
  }
  addCreditCardPayToReceipt() {
    if (this.credirCardService.verifiedCredCard) {
      this.creditCard = this.credirCardService.verifiedCredCard;
      this.creditCard.osumtobill = Number(this.totalAmount);
      this.creditCard.thecurrency = this.currency;
      this.creditCard.oNumOfPayments = this.payByCreditCard.controls.totalPayments.value;
      this.creditCard.ofirstpaymentsum = this.payByCreditCard.controls.firstPayment.value;
      this.addReceiptLine();
      this.receiptService.newReceipt.creditCard = this.creditCard;
      this.showTotalAmount();
      this.receiptService.nextStep();
      console.log(this.receiptService.newReceipt);
    } else {
      alert('Please add your credit card')
    }
  }
  addReceiptLine() {
    debugger
    this.receiptLine = {
      ProjectId: this.project,
      PayTypeId: this.paymentMethodId,
      Amount: null,
      ValueDate: moment(this.dueDate).format('YYYY-MM-DD'),
      CheckNo: null,
      Bank: null,
      BranchNo: '',
      AccountNo: '',
      details: '',
      DonationTypeId: this.paymentFor,
      AccountId: this.accountId,
      AmountInLeadCurrent: null
    };
    this.receiptLines.push(this.receiptLine);
    this.receiptService.newReceipt.Receipt.recieptlines = this.receiptLines;
    this.showTotalAmount();
  }
 
  changePosition() {
    return this.generalService.changePositionElement();
  }
}
