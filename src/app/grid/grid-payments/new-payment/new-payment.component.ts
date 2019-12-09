import { KevaRemarksService } from './keva-remarks/keva-remarks.service';
import { KevaRemark } from './../../payments.service';
import { ResponseData } from './../../../models/response.model';


import { Addresses } from './../../../models/addresses.model';
import { Emails } from './../../../models/emails.model';
import { CustomerCreditCard } from './../../../models/customerCreditCard.model';
import { CreditCardAccount } from './../../../models/credit-card-account.model';
import { Customerinfo } from './../../../models/customerInfo.model';
import { PaymentsService } from '../../payments.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { MatAccordion, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subject, Observable, BehaviorSubject, from, of } from 'rxjs';
import { takeUntil, delay, map, filter, distinctUntilChanged } from 'rxjs/operators';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { PaymentKeva } from 'src/app/models/paymentKeva.model';
import { GlobalData } from 'src/app/models/globalData.model';
import { CreditCardComponent } from 'src/app/receipts/credit-card/credit-card.component';
import { CreditCardService } from 'src/app/receipts/credit-card/credit-card.service';
import { NewPaymentService } from './new-payment.service';
import { Location } from '@angular/common';
import { Creditcard } from 'src/app/models/creditCard.model';
import * as moment from 'moment';
import { Phones } from 'src/app/models/phones.model';
import { ToastrService } from 'ngx-toastr';




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
  // editMode = false;
  // duplicateMode = false;
  kevaMode = 'newKeva'
  isEditFileAs = false;
  subscription$ = new Subject();
  creditCardAccounts$: Observable<CreditCardAccount[]>;
  // listCustomerCreditCard$: Observable<CustomerCreditCard[]>
  newCreditCard: Creditcard;
  employeeList$: Observable<{ employeeId: number, EmpName: string }[]>;
  listCredCard: BehaviorSubject<CustomerCreditCard[]>;
  listCustomerCreditCard$: Observable<CustomerCreditCard[]>;
  listNewCreditCard = <Creditcard[]>[]
  editingKevaId: number;
  editingCustomerId: number;
  // paymentTypes = new BehaviorSubject<string>('');
  // paymentTypes$: Observable<string> = this.paymentTypes.asObservable();
  customerEmails$: Observable<Emails[]>;
  customerAddresses$: Observable<Addresses[]>;
  customerPhones$: Observable<Phones[]>;
  currentLang: string;
  isSubmit = false;
  kevaRemarks$: Observable<KevaRemark[]>;
  constructor(
    private _formBuilder: FormBuilder,
    private paymentsService: PaymentsService,
    private router: Router,
    private generalService: GeneralSrv,
    private dialog: MatDialog,
    private creditCardService: CreditCardService,
    private newPaymentService: NewPaymentService,
    private location: Location,
    private toaster: ToastrService,
    private kevaRemarksService: KevaRemarksService
  ) { }

  ngOnInit() {
    this.createNewPaymentForm();
    this.getGlobalData();
    this.newPaymentForm.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(data => console.log(data));
    console.log('Proj cat', this.projectCat);
    this.getDuplicatingKeva();
    this.getCustomerInfoById();
    this.getPaymentType();
    this.checkKevaMode();
    this.checkIfPaymentTypeChanged();
    this.creditCardValueChanges();
    this.generalService.currentLang$
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((lang: string) => this.currentLang = lang);
    const component = NewPaymentComponent
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
        status: [1, Validators.required],
        groups: ['', Validators.required],
      }),
      secondStep: this._formBuilder.group({
        fileAs: ['', Validators.required],
        ID: ['', [Validators.required, Validators.minLength(9)]],
        tel1: ['', Validators.required],
        tel2: [''],
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
        currency: ['NIS', Validators.required],
        day: ['', Validators.required],
        company: ['', Validators.required],
        startDate: [moment(Date()).format('YYYY-MM-DD'), Validators.required],
        endDate: [moment(Date()).format('YYYY-MM-DD'), [Validators.required, Validators.required]],
        KEVAJoinDate: [moment(Date()).format('YYYY-MM-DD'), [Validators.required, Validators.required]],
        KEVACancleDate: [moment('1900-01-01').format('YYYY-MM-DD'), [Validators.required, Validators.required]],
        monthToCharge: ['9999', [Validators.required, Validators.maxLength(4)]],
        chargeMonth: [0, [Validators.required, Validators.maxLength(4)]],
        leftToCharge: ['9999', [Validators.required, Validators.maxLength(4)]],
        tadirut: [0, Validators.required]
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
  get email() {
    return this.newPaymentForm.get('fifthStep.email');
  }
  get address() {
    return this.newPaymentForm.get('fifthStep.address');
  }
  get receiptName() {
    return this.newPaymentForm.get('fifthStep.receiptName');
  }

  get creditCard() {
    return this.newPaymentForm.get('thirdStep.creditCard');
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
    this.newPaymentService.getCustomerInfoForNewKeva$()
      .pipe(
        filter(customerInfo => customerInfo !== null),
        takeUntil(this.subscription$))
      .subscribe((data: Customerinfo) => {
        if (!!Object.keys(data).length) {
          this.customerInfoById = { ...data };
          this.customerEmails$ = of(this.customerInfoById.emails);
          this.customerAddresses$ = of(this.customerInfoById.addresses);
          this.customerPhones$ = of(this.customerInfoById.phones);
          this.newPaymentService.setFoundedCustomerId(this.customerInfoById.customerMainInfo.customerId);
          this.newPaymentService.updateFormControls(this.newPaymentForm, this.customerInfoById);

          // this.getListCustomerCreditCard()
          this.getListCustomerCreditCard(this.newPaymentService.getfoundedCustomerId());
          console.log('Customer info', this.customerInfoById)
        }
      })
  }
  toCustomerSearch() {
    this.router.navigate(['/payments-grid/customer-search'])
  }

  editFileAs() {
    this.isEditFileAs = true;
  }

  saveEditFileAs(input: AbstractControl, newValue: any) {
    this.newPaymentService.setInputValue(input, newValue);
    this.isEditFileAs = false;
  }

  getEditingPayment() {
    this.newPaymentService.currentEditingPayment$
      .pipe(
        delay(0),
        filter(keva => keva !== null),
        takeUntil(this.subscription$))
      .subscribe((data: PaymentKeva) => {
        if (data) {
          console.log('EDITING PAYMENT', data);
          this.openAllSteps();
          this.newPaymentService.setKevaMode('edit');
          this.newPaymentService.updatePaymentFormForEditeMode(this.newPaymentForm, data)
          this.newPaymentService.setFoundedCustomerId(data.Customerid);
          this.getListCustomerCreditCard(data.Customerid);
          this.editingKevaId = data.Kevaid;
          this.editingCustomerId = data.Customerid
          this.newPaymentService.setEditingKevaIdAndCustomerId(data.Kevaid, data.Customerid);
        } else {
        }
      })
  }

  getDuplicatingKeva() {
    this.newPaymentService.currentDuplicatingKeva$
      .pipe(
        delay(0),
        filter(keva => keva !== null),
        takeUntil(this.subscription$))
      .subscribe((data: PaymentKeva) => {
        if (data) {
          console.log('DUPLICATE KEVA', data);
          this.newPaymentService.setKevaMode('duplicate');
          this.newPaymentService.updatePaymentFormForDuplicateMode(this.newPaymentForm, data, this.customerInfoById);
          this.getListCustomerCreditCard(this.newPaymentService.getfoundedCustomerId());
          // this.editiingKevaId = data.Kevaid;
          this.newPaymentService.updateFormControls(this.newPaymentForm, this.customerInfoById);
        } else {
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
            this.newPaymentService.setBankInputValidations(this.newPaymentForm);
            break
          case '2':
            this.newPaymentService.setBankInputValidations(this.newPaymentForm);
            break
          case '3':
            this.newPaymentService.setCreditCardIdValidation(this.newPaymentForm);
            break
          default:
            this.newPaymentService.setBankInputValidations(this.newPaymentForm);
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
          const message = this.currentLang === 'he' ? 'נשמר בהצלחה' : 'Successfully';
          this.toaster.success('', message, {
            positionClass: 'toast-top-center'
          });
          this.addNewCardToListOfNewCreditCards(credCard.newCredCard);

          this.newPaymentForm.get('thirdStep.creditCard').patchValue({
            credCard: credCard.newCredCard
          });
          this.updateAccount(credCard.newCredCard);
        }
      })
  }

  updateAccount(credCard: Creditcard) {
    if (credCard) {
      this.newPaymentForm.get('fifthStep.account').patchValue(credCard.accountid);
    }

  }

  setDataToNewPaymentKeva() {
    const newKeva = this.newPaymentForm.value;
    this.newPaymentService.setNewPaymentKeva(newKeva)
  }

  getListCustomerCreditCard(customerId?: number | string) {
    this.listCustomerCreditCard$ = this.newPaymentService.currentCreditCardList$.pipe(map(data => data.filter(value => value.customerid === (customerId || null))))
  }

  goBack() {
    // this.setCustomerInfoById(this.customerInfoById.emails, this.customerInfoById.phones, this.customerInfoById.addresses, this.customerInfoById.customermaininfo, '', this.customerInfoById.groups)
    this.location.back();
  }
  checkKevaMode() {
    this.newPaymentService.getKevaMode$()
      .pipe(takeUntil(this.subscription$))
      .subscribe((value: string) => {
        this.kevaMode = value;
        if (this.kevaMode === 'newKeva') {
          this.setStep(1)
        } else {
          this.openAllSteps();
        }
        this.getEmployeeList();
      });
    console.log('EDIT MODE', this.kevaMode)
  }
  getNewCreditCard() {
    return this.newCreditCard;
  }
  getEmployeeList() {
    if (this.kevaMode === 'edit') {
      this.employeeList$ = this.paymentsService.getGlobalData$().pipe(map(data => data.GetEmployeesAll));
    } else {
      this.employeeList$ = this.paymentsService.getGlobalData$().pipe(map(data => data.GetEmployees));
    }
  }

  checkIfPaymentTypeChanged() {
    this.paymentType.valueChanges
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(paymentType => {
        switch (paymentType) {
          case '1':
            this.newPaymentService.setBankInputValidations(this.newPaymentForm);
            this.newPaymentService.clearCreditCardIdValidation(this.newPaymentForm);
            break
          case '2':
            this.newPaymentService.setBankInputValidations(this.newPaymentForm);
            this.newPaymentService.clearCreditCardIdValidation(this.newPaymentForm);
            break
          case '3':
            this.newPaymentService.setCreditCardIdValidation(this.newPaymentForm);
            this.newPaymentService.clearBankInputValidators(this.newPaymentForm);
            break
        }
      });
  }

  saveNewKeva() {
    if (this.newPaymentForm.valid) {
      this.setDataToNewPaymentKeva();
      this.paymentsService.saveNewKeva(this.generalService.getOrgName(), this.newPaymentService.getNewKeva())
        .pipe(
          takeUntil(this.subscription$))
        .subscribe(res => {
          console.log('NEW KEVA RESPONSE', res);
          if (res) {
            if (res['Data'].error === 'false') {
              const message = this.currentLang === 'he' ? 'נשמר בהצלחה' : 'Successfully';
              const title = `מספר לקוח: ${res['Data'].cusomerid}, מספר קבע: ${res['Data'].kevaid}`
              this.toaster.success(title, message, {
                positionClass: 'toast-top-center'
              });
              this.router.navigate(['/home/payments-grid/payments']);
              this.paymentsService.updateKevaTable();
            }
          }
          this.newPaymentService.clearNewKeva();
        })
    } else {
      const message = 'Please fill in the required fields';
      this.toaster.warning('', message, {
        positionClass: 'toast-top-center'
      });
      this.isSubmit = true;
      console.log(this.newPaymentForm.controls)
    }
  }

 

  // duplicateKeva() {
  //   this.setDataToNewPaymentKeva();
  //   this.paymentsService.saveNewKeva(this.generalService.getOrgName(), this.newPaymentService.getNewKeva())
  //     .pipe(
  //       takeUntil(this.subscription$))
  //     .subscribe(res => {
  //       console.log('NEW KEVA RESPONSE', res);
  //       if (res) {
  //         if (res['Data'].error === 'false') {
  //           this.router.navigate(['/home/payments-grid/payments']);
  //           this.paymentsService.updateKevaTable();
  //         }
  //       }
  //       this.newPaymentService.clearNewKeva();
  //     })
  // }

  updateCustomerKeva() {
    if (this.newPaymentForm.valid) {
      this.setDataToNewPaymentKeva();
      this.newPaymentService.setEditKevaId(this.editingKevaId);
      this.paymentsService.updateCUstomerKeva(this.generalService.getOrgName(), this.newPaymentService.getNewKeva())
        .pipe(
          takeUntil(this.subscription$))
        .subscribe((res) => {
          console.log('UPDATE KEVA RESPONSE', res);
          if (res) {
            if (res['Data'].error === 'false') {
              const message = this.currentLang === 'he' ? 'עודכן בהצלחה' : 'Successfully';
              const title = `מספר קבע: ${res['Data'].kevaid}`
              this.toaster.success(title, message, {
                positionClass: 'toast-top-center'
              });
              this.router.navigate(['/home/payments-grid/payments']);
              this.paymentsService.updateKevaTable();
            }
          }
          this.newPaymentService.clearNewKeva();
        })
    } else {
      const message = 'Please fill in the required fields';
      this.toaster.warning('', message, {
        positionClass: 'toast-top-center'
      });
      this.isSubmit = true;
    }

  }

  duplicateCustomerKeva() {
    if (this.newPaymentForm.valid) {
      this.setDataToNewPaymentKeva();
      this.paymentsService.saveNewKeva(this.generalService.getOrgName(), this.newPaymentService.getNewKeva())
        .pipe(
          takeUntil(this.subscription$))
        .subscribe(res => {
          console.log('NEW KEVA RESPONSE', res);
          if (res) {
            if (res['Data'].error === 'false') {
              const message = this.currentLang === 'he' ? 'עודכן בהצלחה' : 'Successfully';
              const title = `מספר לקוח: ${res['Data'].cusomerid}, מספר קבע: ${res['Data'].kevaid}`
              this.toaster.success(title, message, {
                positionClass: 'toast-top-center'
              });
              this.router.navigate(['/home/payments-grid/payments']);
              this.paymentsService.updateKevaTable();
            }
          }
          this.newPaymentService.clearNewKeva();
        })
    } else {
      const message = 'Please fill in the required fields';
      this.toaster.warning('', message, {
        positionClass: 'toast-top-center'
      });
      this.isSubmit = true;
    }
  }
  // setCustomerInfoById(customerEmails: CustomerEmails[], customerPhones: CustomerPhones[], customerAddress: CustomerAddresses[],
  //   customerMainInfo: Customermaininfo[] | MainDetails[],
  //   customerCreditCardTokens?: any[], customerGroupList?: CustomerGroupById[]
  // ) {
  //   this.newPaymentService.setCustomerInfoById(customerEmails, customerPhones, customerAddress,
  //     customerMainInfo,
  //     customerCreditCardTokens, customerGroupList)
  // };

  addNewCardToListOfNewCreditCards(credCard: Creditcard) {
    this.listNewCreditCard.push(credCard);
  }

  goToKevaTable() {
    this.router.navigate(['/home/payments-grid/payments']);
    this.newPaymentService.clearNewKeva();

  }

  creditCardValueChanges() {
    this.creditCard.valueChanges
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((newCredCard: { credCard: Creditcard }) => {
        if (newCredCard.credCard && typeof (newCredCard.credCard) !== 'number') {
          console.log('CURRENT CREDIT CARD', newCredCard.credCard.customername);
          this.updateAccount(newCredCard.credCard);
        }

      })
  }

 



  ngOnDestroy(): void {
    //Called once, before the instance is destroyed
    //Add 'implements OnDestroy' to the class.
    this.setStep(0);
    this.newPaymentService.setEditingPayment(null);
    this.newPaymentService.setDuplicatingKeva(null);
    this.newPaymentService.clearCustomerInfoForNewKeva();
    this.fileAs.patchValue('');
    this.newPaymentService.setKevaMode('newKeva');
    this.newPaymentForm.reset();
    this.subscription$.next();
    this.subscription$.complete();
    console.log('NEW KEVA DESTROED')
    // this.newPaymentService.setCustomerInfo(<Customerinfo>{})
  }
}