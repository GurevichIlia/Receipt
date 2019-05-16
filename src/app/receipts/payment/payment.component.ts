import { Component, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import * as moment from 'moment';
import { NgForm, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CreditCardComponent } from '../credit-card/credit-card.component';




@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, OnChanges {
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
  newCheckOrWire: object;
  // checksOrWires: any[] = [];
  paymentFor: number;
  accountId: number;
  project: number;
  currency: any;
  payment: {};
  payments: any[] = [];
  totalAmount: number;
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private dialog: MatDialog
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
  ngOnChanges() {
  }
  ngOnInit() {
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
  }
  // checkPayType(payType: number) {
  //   if (payType === 3) {
  //     this.receiptService.payByCreditCard.next(true);
  //   } else {
  //     this.receiptService.payByCreditCard.next(false);
  //   }
  //   console.log(this.receiptService.payByCreditCard)
  // }
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
  addPayment(payment: NgForm) {
    console.log('payment', payment.value)
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
    this.payments.push(this.payment);
    this.showTotalAmount();
    this.checkPaymentsLength();
    console.log(this.payments);
  }
  deletePayment(payment) {
    console.log('payment', payment);
    this.payments = this.payments.filter(data => data !== payment);
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
    let totalPrice = 0;
    for (const amount of this.payments) {
      totalPrice += amount.amount;
    }
    this.totalAmount = totalPrice;
    this.receiptService.changeTotalAmount(this.totalAmount);
  }
  addPaymentToReceipt() {
    this.receiptService.newReceipt.payment = this.payments;

    console.log('addPaymentToReceipt', this.receiptService.newReceipt);

  }
}