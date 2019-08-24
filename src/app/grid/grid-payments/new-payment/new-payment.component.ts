import { CustomerCreditCard } from './../../../models/customerCreditCard.model';
import { CreditCardAccount } from './../../../models/credit-card-account.model';
import { Customerinfo } from './../../../models/customerInfo.model';
import { PaymentsService } from '../../payments.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatAccordion, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, delay, map, filter } from 'rxjs/operators';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { PaymentKeva } from 'src/app/models/paymentKeva.model';
import { GlobalData } from 'src/app/models/globalData.model';
import { CreditCardComponent } from 'src/app/receipts/credit-card/credit-card.component';
import { CreditCardService } from 'src/app/receipts/credit-card/credit-card.service';
import { NewPaymentService } from './new-payment.service';
import { Location } from '@angular/common';
import { Creditcard } from 'src/app/models/creditCard.model';
import * as moment from 'moment';


@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.css']
})
export class NewPaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('accordion') expansionPanel: MatAccordion
  step = 0;
  newPaymentForm: FormGroup;
  globalData$: Observable<GlobalData>;
  customerInfoById: Customerinfo;
  editMode = false;
  isEditFileAs = false;
  subscription$ = new Subject();
  creditCardAccounts$: Observable<CreditCardAccount[]>;
  // listCustomerCreditCard$: Observable<CustomerCreditCard[]>
  newCreditCard: Creditcard;
  employeeList$: Observable<{ employeeId: number, EmpName: string }[]>;
  listCredCard: BehaviorSubject<CustomerCreditCard[]>;
  listCustomerCreditCard$: Observable<CustomerCreditCard[]>;
  listNewCreditCard = <Creditcard[]>[]
  editiingKevaId: number;
  // paymentTypes = new BehaviorSubject<string>('');
  // paymentTypes$: Observable<string> = this.paymentTypes.asObservable();
  constructor(
    private _formBuilder: FormBuilder,
    private paymentsService: PaymentsService,
    private router: Router,
    private generalService: GeneralSrv,
    private dialog: MatDialog,
    private creditCardService: CreditCardService,
    private newPaymentService: NewPaymentService,
    private location: Location
  ) { }

  ngOnInit() {
    this.createNewPaymentForm();
    this.getGlobalData();
    this.newPaymentForm.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(data => console.log(data));
    console.log('Proj cat', this.projectCat);
    this.getCustomerInfoById();
    this.getPaymentType();
    this.checkEditMode();
    this.checkIfPaymentTypeChanged();
    
    const component =  NewPaymentComponent
    console.log('COMPONENT', component);
  }
  ngAfterViewInit() {
    this.getEditingPayment();
  }
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }
  createNewPaymentForm() {
    this.newPaymentForm = this._formBuilder.group({
      firstStep: this._formBuilder.group({
        type: ['', Validators.required],
        status: ['', Validators.required],
        groups: ['', Validators.required],
      }),
      secondStep: this._formBuilder.group({
        fileAs: ['', Validators.required],
        ID: ['', Validators.required],
        tel1: ['', Validators.required],
        tel2: ['', Validators.required],
        remark: ['',]
      }),
      thirdStep: this._formBuilder.group({
        bank: this._formBuilder.group({
          codeBank: ['',],
          snif: ['',],
          accNumber: ['',]
        }),
        creditCard: this._formBuilder.group({
          credCard: ['']
        })
      }),
      fourthStep: this._formBuilder.group({
        amount: ['', Validators.required],
        currency: ['', Validators.required],
        day: ['', Validators.required],
        company: ['', Validators.required],
        startDate: [moment(Date()).format('YYYY-MM-DD'), Validators.required],
        endDate: [moment(Date()).format('YYYY-MM-DD'), [Validators.required, Validators.required]],
        KEVAJoinDate: [moment(Date()).format('YYYY-MM-DD'), [Validators.required, Validators.required]],
        KEVACancleDate: [moment('1900-01-01').format('YYYY-MM-DD'), [Validators.required, Validators.required]],
        monthToCharge: ['', [Validators.required, Validators.maxLength(4)]],
        chargeMonth: ['', [Validators.required, Validators.maxLength(4)]],
        leftToCharge: ['', [Validators.required, Validators.maxLength(4)]],
        tadirut: ['', Validators.required]
      }),
      fifthStep: this._formBuilder.group({
        receipt: ['', Validators.required],// receipt ForCanclation: false
        receipt2: ['', Validators.required],// receipt ForCanclation: true
        goal: ['', Validators.required],
        account: ['', Validators.required],
        projCat: ['', Validators.required],
        project: ['', Validators.required],
        employeeId: ['', Validators.required],
        thanksLetter: ['', Validators.required],
        receiptName: ['', Validators.required],
        address: ['', Validators.required],
        email: ['', Validators.required],
        kevaMakeRecieptByYear: ['',]
      })
    })
  }
  get projectCat() {
    return this.newPaymentForm.get('fifthStep.projCat');
  }
  get paymentType() {
    return this.newPaymentForm.get('firstStep.type');
  }
  get fileAs() {
    return this.newPaymentForm.get('secondStep.fileAs');
  }
  get Tz() {
    return this.newPaymentForm.get('secondStep.ID');
  }
  get tel1() {
    return this.newPaymentForm.get('secondStep.tel1');
  }
  get tel2() {
    return this.newPaymentForm.get('secondStep.tel2');
  }
  getGlobalData() {
    this.globalData$ = this.paymentsService.getGlobalData$();
    this.creditCardAccounts$ = this.paymentsService.getGlobalData$().pipe(map(data => data.Accounts));

  }
  openAllSteps() {
    this.expansionPanel.openAll();
    console.log('Open')
  }
  closeAllSteps() {
    this.expansionPanel.closeAll();
  }
  getCustomerInfoById() {
    this.newPaymentService.currentCustomerInfo$
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((data: Customerinfo) => {
        if (!!Object.keys(data).length) {
          this.customerInfoById = data;
          this.setInputValue(this.fileAs, this.customerInfoById.customermaininfo.fileAs);
          this.setInputValue(this.Tz, this.customerInfoById.customermaininfo.tZ);
          this.newPaymentService.setFoundedCustomerId(this.customerInfoById.customermaininfo.customerId);
          // this.getListCustomerCreditCard()
          this.getListCustomerCreditCard(this.newPaymentService.getfoundedCustomerId());
          console.log('Customer info', this.customerInfoById)
        }
      })
  }
  toCustomerSearch() {
    this.router.navigate(['/payments-grid/customer-search'])
  }
  setInputValue(input: AbstractControl, newValue: any) {
    if (newValue === null) {
      newValue = '';
    }
    input.patchValue(newValue);
  }
  editFileAs() {
    this.isEditFileAs = true;
  }
  saveEditFileAs(input: AbstractControl, newValue: any) {
    this.setInputValue(input, newValue);
    this.isEditFileAs = false;
  }
  getEditingPayment() {
    this.newPaymentService.currentEditingPayment$
      .pipe(
        delay(0),
        takeUntil(this.subscription$))
      .subscribe((data: PaymentKeva) => {
        if (data) {
          console.log('EDITING PAYMENT', data);
          this.openAllSteps();
          this.newPaymentService.updatePaymentFormForEditeMode(this.newPaymentForm, data)
          this.newPaymentService.setFoundedCustomerId(data.Customerid);
          this.editiingKevaId = data.Kevaid;
        } else {
          this.setStep(1);
        }
      })
  }
  getPaymentType() {
    this.newPaymentService.currentPaymentType$
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(type => {
        this.paymentType.patchValue(type);
        switch (type) {
          case '1':
            this.setBankInputValidations();
            break
          case '2':
            this.setBankInputValidations();
            break
          case '3':
            this.setCreditCardIdValidation();
            break
          default:
            this.setBankInputValidations();
            this.paymentType.patchValue('1');
            break
        }
      })
  }
  openModalForNewCreditCard() {
    const creditCardDialog = this.dialog.open(CreditCardComponent, { width: '1150px', height: '470px', disableClose: true, data: { fullName: this.fileAs.value, tZ: this.Tz.value, creditCardAccounts: this.creditCardAccounts$ } });
    creditCardDialog.afterClosed()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((credCard: { newCredCard: Creditcard }) => {
        console.log('FROM CREDIT CARD MODAL', credCard);
        // this.newPaymentService.setNewCreditCard({ ...credCard.newCredCard });
        if (credCard.newCredCard) {
          this.addNewCardToListOfNewCreditCards(credCard.newCredCard);

          this.newPaymentForm.get('thirdStep.creditCard').patchValue({
            credCard: credCard.newCredCard
          })
        }
      })
  }
  setDataToNewPaymentKeva() {
    const newKeva = this.newPaymentForm.value;
    this.newPaymentService.setNewPaymentKeva(newKeva)
  }
  getListCustomerCreditCard(customerId?: number | string) {
    this.listCustomerCreditCard$ = this.newPaymentService.currentCreditCardList$.pipe(map(data => data.filter(value => value.customerid === (customerId || null))))
  }
  goBack() {
    this.location.back();
  }
  checkEditMode() {
    this.newPaymentService.getEditMode$()
      .pipe(takeUntil(this.subscription$))
      .subscribe((value: boolean) => this.editMode = value);
    this.getEmployeeList();
    console.log('EDIT MODE', this.editMode)
  }
  getNewCreditCard() {
    return this.newCreditCard;
  }
  getEmployeeList() {
    if (this.editMode) {
      this.employeeList$ = this.paymentsService.getGlobalData$().pipe(map(data => data.GetEmployeesAll));
    } else {
      this.employeeList$ = this.paymentsService.getGlobalData$().pipe(map(data => data.GetEmployees));
    }
  }
  setBankInputValidations() {
    const bank = this.newPaymentForm.get('thirdStep.bank');
    bank.get('codeBank').setValidators([Validators.required, Validators.maxLength(2)]);
    bank.get('snif').setValidators([Validators.required, Validators.maxLength(3)]);
    bank.get('accNumber').setValidators([Validators.required, Validators.maxLength(11)]);
    bank.updateValueAndValidity();
  }
  clearBankInputValidators() {
    const bank = this.newPaymentForm.get('thirdStep.bank');
    for (const key in bank['controls']) {
      bank.get(key).clearValidators();
      bank.get(key).updateValueAndValidity();
    }
  }
  setCreditCardIdValidation() {
    const credCardId = this.newPaymentForm.get('thirdStep.creditCard.credCard');
    credCardId.setValidators(Validators.required);
    credCardId.updateValueAndValidity();
  }
  clearCreditCardIdValidation() {
    const credCardId = this.newPaymentForm.get('thirdStep.creditCard.credCard');
    credCardId.clearValidators();
    credCardId.updateValueAndValidity();
  }
  checkIfPaymentTypeChanged() {
    this.paymentType.valueChanges
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(paymentType => {
        switch (paymentType) {
          case '1':
            this.setBankInputValidations();
            this.clearCreditCardIdValidation();
            break
          case '2':
            this.setBankInputValidations();
            this.clearCreditCardIdValidation();
            break
          case '3':
            this.setCreditCardIdValidation();
            this.clearBankInputValidators();
            break
        }
      });
  }
  saveNewKeva() {
    this.setDataToNewPaymentKeva();
    this.paymentsService.saveNewKeva(this.generalService.getOrgName(), this.newPaymentService.getNewKeva())
      .pipe(
        takeUntil(this.subscription$)).subscribe(res => {
          console.log('NEW KEVA RESPONSE', res);
          this.newPaymentService.clearNewKeva();
        })
  }
  updateCustomerKeva() {
    this.setDataToNewPaymentKeva();
    this.newPaymentService.setEditKevaId(this.editiingKevaId);
    this.paymentsService.updateCUstomerKeva(this.generalService.getOrgName(), this.newPaymentService.getNewKeva())
      .pipe(
        takeUntil(this.subscription$)).subscribe(res => {
          console.log('UPDATE KEVA RESPONSE', res);
          this.newPaymentService.clearNewKeva();
        })
  }
  addNewCardToListOfNewCreditCards(credCard: Creditcard) {
    this.listNewCreditCard.push(credCard);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed
    //Add 'implements OnDestroy' to the class.
    this.setStep(0);
    this.newPaymentService.setEditingPayment('');
    this.fileAs.patchValue('');
    this.newPaymentService.setEditMode(false);
    this.subscription$.next();
    this.subscription$.complete();
    this.newPaymentService.setCustomerInfo(<Customerinfo>{})
  }
}