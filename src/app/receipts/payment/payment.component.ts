import { CustomerInfoService } from 'src/app/shared/share-components/customer-info/customer-info.service';
import { CreditCardService } from './../credit-card/credit-card.service';
import { Component, OnInit, ViewChild, AfterViewInit, DoCheck, OnDestroy } from '@angular/core';
import { ReceiptsService } from 'src/app/shared/services/receipts.service';
import { GeneralSrv } from 'src/app/shared/services/GeneralSrv.service';
import * as moment from 'moment';
import { NgForm, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatDialog} from '@angular/material';
import { Receiptlines } from 'src/app/models/receiptlines.model';
import { Creditcard } from 'src/app/models/creditCard.model';
import { ToastrService } from 'ngx-toastr';
import { DonationType } from 'src/app/models/donationType.model';
import { LastSelection } from 'src/app/models/lastSelection.model';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  step: number;
  @ViewChild('myForm') paymentForm: NgForm;
  paymentMethodId = null;
  bankInput = new FormControl();
  filteredOptions: Observable<any[]>;
  dueDate: string;
  paymentMethods: object[] = [];
  currencyTypes: object[] = [];
  donationTypes: DonationType[] = [];
  accounts: object[] = [];
  associations: object[] = [];
  // associationId: number;
  projectsCategories: object[] = [];
  projects: object[] = [];
  filteredProjects: any[] = [];
  banks: string[] = [];
  receiptLines: Receiptlines[] = [];
  receiptLine: Receiptlines;
  newCheckOrWire: object;
  currentLang: string;
  payments: any[] = [];
  nextStepIsDisabled = true;
  payByCreditCard: FormGroup;
  creditCard: Creditcard;
  paymentOptionsGroup: FormGroup;
  isSubmit = false;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private dialog: MatDialog,
    private credirCardService: CreditCardService,
    private fb: FormBuilder,
    private toster: ToastrService,
    private customerInfoService: CustomerInfoService
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
    this.receiptService.selectedPaymentMethod.subscribe(payId => {
      console.log('payMethod', payId)
      this.receiptService.clearReceiptLines();
      console.log('WORK PAY METH CHANGED');
    });
    this.getDataFromGeneralService();
    this.createPaymentOptionsGroupForm();
    this.getLastSelection();
    this.getCurrentLanguage();

    // tslint:disable-next-line: max-line-length
    this.clearProjectIfCatProjectIdChanged();

    this.getCurrentStep();

    this.refreshFormFieldsIfPushedCreateNew();
    this.getCurrentCurrency();
    this.getCurrentPaymentMethodId();

    this.filterOption();
    // this.checkFieldsValue();
    this.getCurrentAmount();
    this.checkChangesInForm();
  }
  ngDoCheck() {
  }
  ngAfterViewInit() {

  }
  getCurrentLanguage() {
    this.subscriptions.add(this.generalService.currentLang$.subscribe((lang: string) => {
      this.currentLang = lang;
    }));
  }
  checkChangesInForm() {
    this.paymentOptionsGroup.valueChanges.subscribe(data => this.checkIfNextStepIsDisabled());
  }
  getCurrentStep() {
    this.subscriptions.add(this.receiptService.currentStep$.subscribe(step => this.step = step));
  }
  clearProjectIfCatProjectIdChanged() {
    this.paymentOptionsGroup.controls.projectCategory.valueChanges.subscribe((catId: number) => {
      this.paymentOptionsGroup.get('project').patchValue('');
      this.filterProjectsByCategory(catId);
      this.checkIfNextStepIsDisabled();
    });
  }
  getCurrentAmount() {
    this.subscriptions.add(this.receiptService.currentAmount$.subscribe(data => {
      this.paymentAmount.patchValue(data); // Setter
    }));
  }
  getCurrentPaymentMethodId() {
    this.subscriptions.add(this.receiptService.selectedPaymentMethod.subscribe(data => {
      this.paymentMethodId = data;
    }));
  }
  getCurrentCurrency() {
    this.subscriptions.add(this.receiptService.selCurrencyId$.subscribe(currencyId => {
      this.paymentOptionsGroup.get('currency').patchValue(currencyId);
    }));
  }
  refreshFormFieldsIfPushedCreateNew() {
    this.subscriptions.add(this.customerInfoService.createNewEvent$.subscribe(() => {
      this.refreshCheckForm();
      this.paymentAmount.patchValue('');
      this.paymentAmount.markAsUntouched();
    }));
  }
  getDataFromGeneralService() {
    this.subscriptions.add(this.receiptService.getGlobalReceiptData$().subscribe(data => {
      this.paymentMethods = data['PaymentTypes'];
      this.currencyTypes = data['GetCurrencyTypes'];
      this.donationTypes = data['DonationTypes'];
      this.accounts = data['Accounts'];
      this.projectsCategories = data['ProjectsCategories'];
      this.projects = data['Projects4Receipts'];
      this.banks = data['Banks'];
      this.associations = data['Associations'],
      this.filterProjectsByCategory();
    }));
  }
  set paymentAmount(value) {
    this.paymentOptionsGroup.get('paymentAmount').patchValue(value);
  }
  createPaymentOptionsGroupForm() {
    this.paymentOptionsGroup = this.fb.group({
      paymentAmount: [''],
      currency: [this.receiptService.selReceiptCurrencyId, [Validators.required]],
      paymentFor: ['', [Validators.required]],
      projectCategory: ['', [Validators.required]],
      accountId: ['', [Validators.required]],
      dueDate: [moment().format('YYYY-MM-DD'), [Validators.required]],
      project: ['', [Validators.required]],
      associationId: ['', [Validators.required]]
    });


  }
  get projectCategory() {
    return this.paymentOptionsGroup.get('projectCategory');
  }
  get project() {
    return this.paymentOptionsGroup.get('project');
  }
  get associationId() {
    return this.paymentOptionsGroup.get('associationId');
  }
  get paymentFor() {
    return this.paymentOptionsGroup.get('paymentFor');
  }
  get accountId() {
    return this.paymentOptionsGroup.get('accountId');
  }
  get paymentAmount() {
    return this.paymentOptionsGroup.get('paymentAmount');
  }
  getLastSelection() {
    this.subscriptions.add(this.generalService.currentLastSelect$.subscribe((lastSelect: LastSelection) => {
      if (lastSelect === null) {
      } else {
        this.projectCategory.patchValue(lastSelect.projectCategory);
        this.project.patchValue(lastSelect.project);
        this.associationId.patchValue(lastSelect.associationId);
        this.paymentFor.patchValue(lastSelect.paymentFor);
        this.accountId.patchValue(lastSelect.accountId);
      }
    }));
  }
  filterOption() {
    this.filteredOptions = this.bankInput.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return this.banks.filter(bank => bank['BankNameEng'].toLowerCase().includes(filterValue));
  }
  filterProjectsByCategory(catId?: number) {
    this.filteredProjects = Object.assign([], this.projects);
    if (catId) {
      this.filteredProjects = this.filteredProjects.filter(data =>
        data['ProjectCategoryId'] === catId
      );
    }
  }
  addPaymentToList(payment: NgForm) {
    console.log('payment', payment.value)
    const paymentDate = moment(payment.value['dueDate']).format('DD/MM/YYYY');
    const paymentCheckNo =
      // this.checksOrWires.push(payment.value);
      this.newCheckOrWire['dueDate'] = moment(payment.value['dueDate']).add(1, 'month').format('YYYY-MM-DD');
    this.newCheckOrWire['checkNum'] = this.newCheckOrWire['checkNum'] + 1;
    const paymentOptionsGroup = this.paymentOptionsGroup.controls;
    this.receiptLine = {
      ProjectId: paymentOptionsGroup.project.value,
      PayTypeId: this.paymentMethodId,
      Amount: payment.value.amount,
      ValueDate: paymentDate,
      CheckNo: payment.value.checkNum,
      Bank: this.bankInput.value,
      BranchNo: payment.value.branch,
      AccountNo: payment.value.payAccount,
      details: '',
      DonationTypeId: paymentOptionsGroup.paymentFor.value,
      AccountId: paymentOptionsGroup.accountId.value,
      AmountInLeadCurrent: payment.value.amount,
    };
    console.log('this.receiptLine', this.receiptLine);
    // this.payments.push(this.payment);
    this.receiptService.addToReceiptLines(this.receiptLine);
    this.showTotalAmount();
    this.checkPaymentsLength();
    this.checkIfNextStepIsDisabled();
    console.log('Receipltiles Receipt Service', this.receiptService.newReceipt.Receipt.recieptlines);
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
    if (this.receiptService.getReceiptLines().length === 0) {
      this.receiptService.blockPaymentMethod.next(false);
    } else {
      this.receiptService.blockPaymentMethod.next(true);
    }
  }
  showTotalAmount() {
    let totalPrice = 0;
    if (this.paymentMethodId === 3) {
      this.receiptService.changeTotalAmount(this.paymentAmount.value);
    } else if (this.paymentMethodId === 2 || this.paymentMethodId === 7) {
      // this.paymentAmount = totalPrice;
      this.paymentAmount.patchValue(this.receiptService.calculateTotalAmountForReceiptLines());
    } else {

    }
  }
  addPaymentToReceipt() {
    this.showTotalAmount();
    const associationId: number = this.paymentOptionsGroup.get('associationId').value;
    const paymentAmount = this.paymentOptionsGroup.get('paymentAmount').value;
    this.receiptService.setAssociationId(associationId);
    if (paymentAmount > 0 && paymentAmount != '' && this.paymentOptionsGroup.valid) {
      if (this.paymentMethodId === 3) {
        this.addCreditCardPayToReceipt();
        this.setItemsToLocalStorage();
        this.getNameOfPaymentFor();
        this.receiptLines = [];
      } else if (this.paymentMethodId === 2 || this.paymentMethodId === 7) {
        // tslint:disable-next-line: max-line-length
        this.receiptService.addAmountInLeadCurrentToReceiptLine(this.paymentAmount.value); // use Getter for this.paymentOptionsGroup.controls.paymentAmount.value
        this.receiptService.amount.next(this.paymentAmount.value); // use Getter for this.paymentOptionsGroup.controls.paymentAmount.value
        this.setItemsToLocalStorage();
        this.getNameOfPaymentFor();
        this.receiptService.nextStep();
        console.log('addPaymentToReceipt', this.receiptService.newReceipt);
      } else {
        this.receiptService.clearReceiptLines();
        this.addReceiptLine();
        this.receiptService.amount.next(this.paymentAmount.value);
        this.getNameOfPaymentFor();
        this.setItemsToLocalStorage();
        this.receiptService.nextStep();
      }
    } else {
      this.toster.warning('Please fill in the required fields', '', {
        positionClass: 'toast-top-center'
      });
      this.isSubmit = true;
    }

  }
/**
 * 
 */
  addCreditCardPayToReceipt() {
    if (this.credirCardService.verifiedCredCard) {
      this.creditCard = this.credirCardService.verifiedCredCard;
      this.receiptService.clearReceiptLines();
      this.addReceiptLine();
      this.receiptService.addCreditCardToNewReceipt(this.creditCard);
      this.showTotalAmount();
      this.receiptService.nextStep();
      console.log(this.receiptService.newReceipt);
    } else {
      alert('Please add your credit card')
    }
  }
  /** * Добавляет receiptline с нужными данными в NewReceipt, только при оплате картой */
  addReceiptLine() {
    const paymentOptionsGroup = this.paymentOptionsGroup.controls;
    this.receiptLine = {
      ProjectId: paymentOptionsGroup.project.value,
      PayTypeId: this.paymentMethodId,
      Amount: null,
      ValueDate: moment(paymentOptionsGroup.dueDate.value).format('DD/MM/YYYY'),
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
    this.generalService.setItemToLastSelection('projectCategory', paymentOptionsGroup.projectCategory.value);
    this.generalService.setItemToLastSelection('paymentFor', paymentOptionsGroup.paymentFor.value);
    this.generalService.setItemToLastSelection('accountId', paymentOptionsGroup.accountId.value);
    this.generalService.setItemToLastSelection('project', paymentOptionsGroup.project.value);
    this.generalService.setItemToLastSelection('associationId', paymentOptionsGroup.associationId.value);
  }

  checkIfNextStepIsDisabled() {
    if (this.paymentMethodId === 2 || this.paymentMethodId === 7) {
      if (this.receiptService.newReceipt.Receipt.recieptlines.length === 0) {
        this.nextStepIsDisabled = true;
      } else {
        this.nextStepIsDisabled = false;
      }
    } else {
      if (this.paymentOptionsGroup.valid) {
        this.nextStepIsDisabled = false;
      } else {
        this.nextStepIsDisabled = true;
      }
    }
  }
  refreshCheckForm() {
    this.bankInput.reset();
    this.newCheckOrWire = {
      payAccount: '',
      dueDate: this.dueDate,
      bank: '',
      amount: '',
      branch: '',
      checkNum: null
    };
    console.log(this.paymentForm);
  }
  getNameOfPaymentFor() {
    const selectedDonationType = this.donationTypes.filter(type => type.DonationTypeId === this.paymentFor.value);
    console.log('PAYMENT FOR', selectedDonationType);
    this.receiptService.nameOfPaymentFor.next(selectedDonationType[0].DonationTypeEng);
  }
  ngOnDestroy() {
    console.log('CUSTOMER INFO SUBSCRIBE', this.subscriptions);
    this.subscriptions.unsubscribe();
    console.log('CUSTOMER INFO SUBSCRIBE On Destroy', this.subscriptions);
  }
}
