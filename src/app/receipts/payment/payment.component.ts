import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
export class PaymentComponent implements OnInit {
  paymentMethodId: number;
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
  newCheckOrWire;
  checksOrWires: any[] = [];
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private dialog: MatDialog
  ) {
    this.dueDate = moment().format('YYYY-MM-DD');
    this.newCheckOrWire = {
      account: '',
      dueDate: this.dueDate,
      bank: '',
      amount: '',
      branch: '',
      checkNum: null
    }
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
    this.checksOrWires.push(payment.value);
    this.newCheckOrWire['dueDate'] = moment(payment.value['dueDate']).add(1, 'month').format('YYYY-MM-DD');
    this.newCheckOrWire.checkNum = this.newCheckOrWire.checkNum + 1;
  }
  deletePayment(payment) {
    console.log('payment', payment)
    this.checksOrWires = this.checksOrWires.filter(data => data !== payment);
    console.log('this.checksOrWires', this.checksOrWires)
  }
  // creditCardModalOpen() {
  //   console.log(this.paymentMethodId.value)
  //   if (this.paymentMethodId.value === 3) {
  //     this.dialog.open(CreditCardComponent, { width: '350px' });
  //   } else {
  //     this.receiptService.setStep(5);
  //     this.receiptService.nextStep();
  //   }

  // }
}