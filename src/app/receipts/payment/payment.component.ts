import { CreditCardService } from './../credit-card/credit-card.service';
import { Component, OnInit, ViewChild, ElementRef, OnChanges, Input, ChangeDetectorRef, AfterViewInit, DoCheck } from '@angular/core';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import * as moment from 'moment';
import { NgForm, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class PaymentComponent implements OnInit, AfterViewInit, DoCheck {
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
  associations: object[] = [];
  associationId: number;
  projectsCategories: object[] = [];
  projects: object[] = [];
  filteredProjects: any[] = [];
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
  nextStepDisabled = true;
  // totalAmount: number;
  payByCreditCard: FormGroup;
  totalAmount: number;
  creditCard: Creditcard;
  paymentOptionsGroup: FormGroup;
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private dialog: MatDialog,
    private credirCardService: CreditCardService,
    private fb: FormBuilder
  ) {
    this.dueDate = moment().format('YYYY-MM-DD');
    // this.payment = {
    //   payTypeMethod: null,
    //   amount: null,
    //   currency: null,
    //   paymentFor: null,
    //   account: null,
    //   project: null,
    //   payAccount: '',
    //   dueDate: this.dueDate,
    //   bank: '',
    //   branch: '',
    //   checkNum: null
    // };
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
    this.createPaymentOptionsGroupForm();
    
    this.paymentOptionsGroup.controls.projectCategory.valueChanges.pipe(debounceTime(300)).subscribe((catId: number) => {
      // this.paymentOptionsGroup.get('project').patchValue('');
      this.projectFilterByCatId(catId);
    });
    this.receiptService.currentlyStep.subscribe(step => this.step = step);

    this.generalService.receiptData.subscribe(data => {
      this.paymentMethods = data['PaymentTypes'];
      this.currencyTypes = data['GetCurrencyTypes'];
      this.donationTypes = data['DonationTypes'];
      this.accounts = data['Accounts'];
      this.projectsCategories = data['ProjectsCategories'];
      this.projects = data['Projects4Receipts'];
      this.banks = data['Banks'];
      this.associations = data['Associations'],
      this.projectFilterByCatId();
    });
    this.receiptService.selectedPaymentMethod.subscribe(data => {
      this.paymentMethodId = data;
    });
    this.receiptService.selCurrencyId.subscribe(currencyId => {
      this.paymentOptionsGroup.get('currency').patchValue(currencyId);
    });
    this.filterOption();
    // this.checkFieldsValue();
    this.receiptService.currentlyAmount.subscribe(data => {

      this.totalPaymentAmount = data; // Setter
    });

  }
  ngDoCheck() {
    this.nextStep();
  }
  ngAfterViewInit() {

  }
  get totalPaymentAmount() {
    return this.paymentOptionsGroup.controls.paymentAmount.value;
  }
  set totalPaymentAmount(value) {
    this.paymentOptionsGroup.get('paymentAmount').patchValue(value);
  }
  createPaymentOptionsGroupForm() {
    return this.paymentOptionsGroup = this.fb.group({
      paymentAmount: [0],
      currency: [this.receiptService.selReceiptCurrencyId],
      paymentFor: [+this.generalService.getItemsFromLocalStorage('paymentFor')],
      projectCategory: [+this.generalService.getItemsFromLocalStorage('projectCategory')],
      accountId: [+this.generalService.getItemsFromLocalStorage('accountId')],
      dueDate: [moment().format('YYYY-MM-DD')],
      project: [+this.generalService.getItemsFromLocalStorage('project')],
      associationId: [+this.generalService.getItemsFromLocalStorage('associationId')]
    });
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
  projectFilterByCatId(catId?: number) {
    this.filteredProjects = Object.assign([], this.projects);
    if (catId) {
      this.filteredProjects = this.filteredProjects.filter(data =>
        data['ProjectCategoryId'] === catId
      );
    }
  }
  addPaymentToList(payment: NgForm) {
    console.log('payment', payment.value)
    payment.value['dueDate'] = moment(payment.value['dueDate']).format('YYYY/MM/DD');
    // this.checksOrWires.push(payment.value);
    this.newCheckOrWire['dueDate'] = moment(payment.value['dueDate']).add(1, 'month').format('YYYY-MM-DD');
    this.newCheckOrWire['checkNum'] = this.newCheckOrWire['checkNum'] + 1;
    const paymentOptionsGroup = this.paymentOptionsGroup.controls;
    this.receiptLine = {
      ProjectId: paymentOptionsGroup.project.value,
      PayTypeId: this.paymentMethodId,
      Amount: payment.value.amount,
      ValueDate: payment.value.dueDate,
      CheckNo: payment.value.checkNum,
      Bank: this.myControl.value,
      BranchNo: payment.value.branch,
      AccountNo: payment.value.payAccount,
      details: '',
      DonationTypeId: paymentOptionsGroup.paymentFor.value,
      AccountId: paymentOptionsGroup.accountId.value,
      AmountInLeadCurrent: payment.value.amount,
    };
    console.log('this.receiptLine', this.receiptLine);
    this.payments.push(this.payment);
    this.receiptService.addToReceiptLines(this.receiptLine);
    this.showTotalAmount();
    this.checkPaymentsLength();
    console.log(this.payments);
    console.log(this.receiptLines)
  }
  deletePayment(payment) {
    console.log('payment', payment);
    this.payments = this.payments.filter(data => data !== payment);
    // this.receiptLines = this.receiptLines.filter(data => data !== payment);
    this.receiptService.deleteFromReceiptLines(payment);
    // console.log('this.payments', this.payments);
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
    if (this.paymentMethodId === 3) {
      this.receiptService.changeTotalAmount(this.totalPaymentAmount);
    } else if (this.paymentMethodId === 2 || this.paymentMethodId === 7) {
      // this.totalPaymentAmount = totalPrice;
      this.totalPaymentAmount = this.receiptService.calculateTotalAmountForReceiptLines();
    } else {

    }
  }
  addPaymentToReceipt() {
    this.showTotalAmount();
    const associationId: number = this.paymentOptionsGroup.get('associationId').value;
    this.receiptService.setAssociationId(associationId);
    if (this.paymentMethodId === 3) {
      this.addCreditCardPayToReceipt();
      this.setItemsToLocalStorage();
      this.receiptLines = [];
    } else if (this.paymentMethodId === 2 || this.paymentMethodId === 7) {
      // tslint:disable-next-line: max-line-length
      this.receiptService.addAmountInLeadCurrentToReceiptLine(this.totalPaymentAmount); // use Getter for this.paymentOptionsGroup.controls.paymentAmount.value
      this.receiptService.amount.next(this.totalPaymentAmount); // use Getter for this.paymentOptionsGroup.controls.paymentAmount.value
      this.setItemsToLocalStorage();
      this.receiptService.nextStep();
      console.log('addPaymentToReceipt', this.receiptService.newReceipt);
    } else {
      this.addReceiptLine();
      this.receiptService.amount.next(this.totalPaymentAmount);
      this.setItemsToLocalStorage();
      this.receiptService.nextStep();
    }
  }
  addCreditCardPayToReceipt() {
    if (this.credirCardService.verifiedCredCard) {
      this.creditCard = this.credirCardService.verifiedCredCard;
      this.addReceiptLine();
      this.receiptService.addCreditCardToNewReceipt(this.creditCard);
      this.showTotalAmount();
      this.receiptService.nextStep();
      console.log(this.receiptService.newReceipt);
    } else {
      alert('Please add your credit card')
    }
  }
  /**
   * Добавляет receiptline с нужными данными в NewReceipt, только при оплате картой
   */
  addReceiptLine() {
    const paymentOptionsGroup = this.paymentOptionsGroup.controls;
    this.receiptLine = {
      ProjectId: paymentOptionsGroup.project.value,
      PayTypeId: this.paymentMethodId,
      Amount: null,
      ValueDate: moment(this.dueDate).format('YYYY/MM/DD'),
      CheckNo: null,
      Bank: null,
      BranchNo: '',
      AccountNo: '',
      details: '',
      DonationTypeId: paymentOptionsGroup.paymentFor.value,
      AccountId: paymentOptionsGroup.accountId.value,
      AmountInLeadCurrent: null
    };
    this.receiptService.addToReceiptLines(this.receiptLine);
    this.showTotalAmount();
  }
  changePosition() {
    return this.generalService.changePositionElement();
  }
  setItemsToLocalStorage() {
    const paymentOptionsGroup = this.paymentOptionsGroup.controls;
    localStorage.setItem('projectCategory', paymentOptionsGroup.projectCategory.value);
    localStorage.setItem('currency', paymentOptionsGroup.currency.value);
    localStorage.setItem('paymentFor', paymentOptionsGroup.paymentFor.value);
    localStorage.setItem('accountId', paymentOptionsGroup.accountId.value);
    localStorage.setItem('project', paymentOptionsGroup.project.value);
    localStorage.setItem('associationId', paymentOptionsGroup.associationId.value);
  }
  nextStep() {
    if (this.paymentOptionsGroup.invalid) {
      this.nextStepDisabled = true;
      if (1 > this.receiptService.newReceipt.Receipt.recieptlines.length) {
        this.nextStepDisabled = true;
      } else {
        this.nextStepDisabled = false;
      }
    } else {
      this.nextStepDisabled = false;
    }
  }
}
