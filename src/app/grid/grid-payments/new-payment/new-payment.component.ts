import { CustomerCreditCard } from './../../../models/customerCreditCard.model';
import { CreditCardAccount } from './../../../models/credit-card-account.model';
import { Customerinfo } from './../../../models/customerInfo.model';
import { PaymentsService } from '../../payments.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatAccordion, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { PaymentsFilterComponent } from '../payments-table-header/payments-filter/payments-filter.component';
import { Subject, Observable } from 'rxjs';
import { takeUntil, delay, map, filter } from 'rxjs/operators';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { PaymentKeva } from 'src/app/models/paymentKeva.model';
import { GlobalData } from 'src/app/models/globalData.model';
import { CreditCardComponent } from 'src/app/receipts/credit-card/credit-card.component';
import { CreditCardService } from 'src/app/receipts/credit-card/credit-card.service';

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
  listCustomerCreditCard: CustomerCreditCard[] = [];
  listCustomerCreditCard$: Observable<CustomerCreditCard[]>
  constructor(
    private _formBuilder: FormBuilder,
    private paymentsService: PaymentsService,
    private router: Router,
    private generalService: GeneralSrv,
    private dialog: MatDialog,
    private creditCardService: CreditCardService
  ) { }

  ngOnInit() {
    this.createNewPaymentForm();
    this.getGlobalData();
    this.newPaymentForm.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(data => console.log(data));
    console.log('Proj cat', this.projectCat);
    this.getCustomerInfoById();
    this.getPaymentType();
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
        type: ['1', Validators.required],
        status: ['', Validators.required],
        groups: ['', Validators.required],
      }),
      secondStep: this._formBuilder.group({
        fileAs: ['', Validators.required],
        ID: ['', Validators.required],
        tel1: ['', Validators.required],
        tel2: ['', Validators.required],
        remark: ['', Validators.required]
      }),
      thirdStep: this._formBuilder.group({
        bank: this._formBuilder.group({
          codeBank: ['', [Validators.required, Validators.maxLength(2)]],
          snif: ['', [Validators.required, Validators.maxLength(3)]],
          accNumber: ['', [Validators.required, Validators.maxLength(11)]]
        }),
        creditCard: this._formBuilder.group({
          credCard: ['', Validators.required]
        })
      }),
      fourthStep: this._formBuilder.group({
        amount: ['', Validators.required],
        currency: ['', Validators.required],
        day: ['', Validators.required],
        company: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        KEVAJoinDate: ['', Validators.required],
        KEVACancleDate: ['', Validators.required],
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
        input1: ['', Validators.required],
        thanksLetter: ['', Validators.required],
        fileAs: ['', Validators.required],
        address: ['', Validators.required],
        field: ['', Validators.required],
        checkbox: ['', Validators.required]
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
    this.globalData$ = this.paymentsService.currentGlobalData$;
    this.creditCardAccounts$ = this.paymentsService.currentGlobalData$.pipe(map(data => data.Accounts));
  }
  openAllSteps() {
    this.expansionPanel.openAll();
    console.log('Open')
  }
  closeAllSteps() {
    this.expansionPanel.closeAll();
  }
  getCustomerInfoById() {
    this.paymentsService.currentCustomerInfo$
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((data: Customerinfo) => {
        if (!!Object.keys(data).length) {
          this.customerInfoById = data;
          this.setInputValue(this.fileAs, this.customerInfoById.customermaininfo.fileAs);
          this.setInputValue(this.Tz, this.customerInfoById.customermaininfo.tZ);
          // this.getListCustomerCreditCard()
          this. getListCustomerCreditCard();
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
    this.paymentsService.currentEditingPayment$
      .pipe(
        delay(0),
        takeUntil(this.subscription$))
      .subscribe((data: PaymentKeva) => {
        if (data) {
          console.log('EDITING PAYMENT', data);
          this.openAllSteps();
          this.paymentsService.updatePaymentFormForEditeMode(this.newPaymentForm, data)
        } else {
          this.setStep(1);
        }
      })
  }
  getPaymentType() {
    this.paymentsService.currentPaymentType$
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(type => {
        this.paymentType.patchValue(type);
      })
  }
  openModalForNewCreditCard() {
    this.dialog.open(CreditCardComponent, { width: '1150px', height: '500px', data: { fullName: this.fileAs.value, tZ: this.Tz.value, creditCardAccounts: this.creditCardAccounts$ } });
  }
  setDataForNewPaymentKeva() {
    const newKeva = this.newPaymentForm.value;
    this.paymentsService.setNewPaymentKeva(newKeva)
  }
  // getListCustomerCreditCard() {
  //   this.listCustomerCreditCard = this.paymentsService.getListCustomerCreditCard();
  // }
  getListCustomerCreditCard(customerId?: number) {
    this.listCustomerCreditCard$ = this.paymentsService.currentCreditCardList$.pipe(map(data => {
      console.log('TEST', data)
      return data;
    }))
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.setStep(0);
    this.paymentsService.setEditingPayment('');
    this.fileAs.patchValue('');
    this.subscription$.next();
    this.subscription$.complete();
  }
}
