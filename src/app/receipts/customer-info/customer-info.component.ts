import { Customermaininfo } from './../../models/customermaininfo.model';
import { Observable } from 'rxjs';
import { CreditCardService } from './../credit-card/credit-card.service';
import { Component, OnInit, Input, OnChanges, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ReceiptsService } from '../../services/receipts.service';
import { FormArray, NgForm, Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { CreditCardComponent } from '../credit-card/credit-card.component';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { startWith, map } from 'rxjs/operators';
import { Customerinfo } from 'src/app/models/customerInfo.model';



@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() customerInfo: Customerinfo;
  @Input() currentlyLang: string;
  @Input() cities: any[];
  step: number;
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  // @ViewChild('PaymentMethod') payMethodId: any;
  paymentMethodId: number = null;
  userInfoGroup: FormGroup;
  groups: any[] = [];
  paymentMethods: object[] = [];
  // customerInfo: object;
  customerInfoTitle: string;
  customerFound = false;
  requiredField = true;
  disabledPayMethod = false;
  clickToBtnCreateNew = false;
  // tslint:disable-next-line: max-line-length
  pattern = '^(((0[1-9]|[12][0-9]|30)[-/]?(0[13-9]|1[012])|31[-/]?(0[13578]|1[02])|(0[1-9]|1[0-9]|2[0-8])[-/]?02)[-/]?[0-9]{4}|29[-/]?02[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$';
  subs;
  // selectedPayMethod: number;
  isVerified = false;
  nextStepDisabled = true;
  // currentlyLang: string;
  payMath: FormControl;
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private creditCardService: CreditCardService
  ) {
    // tslint:disable-next-line: max-line-length
    this.payMath = new FormControl({ value: localStorage.getItem('paymenthMethod') ? Number(localStorage.getItem('paymenthMethod')) : null, disabled: this.disabledPayMethod }, [Validators.required])
    // this.firstName = '';
    // this.lastName = '';
    // this.customerId = null
    // tslint:disable-next-line: max-line-length
    const emailName = `${this.getItemsFromSessionStorage('firstName')} ${this.getItemsFromSessionStorage('lastName')} ${this.getItemsFromSessionStorage('company')}`
    this.paymentMethodId = localStorage.getItem('paymenthMethod') ? Number(localStorage.getItem('paymenthMethod')) : null;
    this.userInfoGroup = this.fb.group({
      customerMainInfo: this.fb.group({
        customerId: [null],
        firstName: [this.getItemsFromSessionStorage('firstName')],
        lastName: [this.getItemsFromSessionStorage('lastName')],
        company: [this.getItemsFromSessionStorage('company')],
        // tslint:disable-next-line: max-line-length
        customerType: [''],
        title: [''],
        gender: [null],
        tZ: [''],
        spouseName: [''],
        fileAs: [''],
        birthday: [''],
        afterSunset: [false],
      }),
      phones: this.fb.array([
        this.fb.group({
          PhoneTypeId: [2],
          phone: ['']
        })
      ]),
      emails: this.fb.array([
        this.fb.group({
          emailname: [emailName],
          email: [''],
        })
      ]),
      addresses: this.fb.group({
        city: [''],
        street: [''],
        zip: [''],
      }),
      groups: [],
    });

    console.log(this.userInfoGroup)
    // this.groups = this.customerInfo['QuickGeneralGroupList'];
  }
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
  ngOnChanges() {
    this.changeValue(this.customerInfo);
    console.log('isVerified ;', this.isVerified);
    console.log('nextStepDisabled', this.nextStepDisabled);

    console.log('OnChanges', '11111');
    this.creditCardService.currentlyCreditCardVarified.subscribe((isVerified: boolean) => {
      this.isVerified = isVerified;
      console.log('this.isVerified', this.isVerified);
      this.disabledNextStep();
    });
  }

  ngOnInit() {
    console.log('this.payMath', this.payMath)
    this.receiptService.currentlyStep.subscribe(step => this.step = step);
    // this.userInfoGroup.valueChanges.subscribe(data => {
    //   if (data.firstName !== '' || data.lastName !== '' || data.company !== '') {
    //     this.requiredField = false;
    //     console.log('this.userInfoGroup.invalid', this.userInfoGroup.invalid)
    //   } else {
    //     this.requiredField = true;
    //     console.log('this.userInfoGroup.invalid', this.userInfoGroup.invalid)
    //   }
    // });
    this.userInfoGroup.controls.emails.valueChanges.subscribe(data => console.log('Form', data));
    this.getPaymentTypes();
    this.getPayMethFromLocalStorage();
    // if (localStorage.getItem('paymenthMethod')) {
    //   if (localStorage.getItem('paymenthMethod') === '3') {
    //     this.paymentMethodId = Number(localStorage.getItem('paymenthMethod'));
    //   } else {
    //     this.paymentMethodId = Number(localStorage.getItem('paymenthMethod'));
    //   }
    //   this.creditCardService.currentlyCreditCardVarified.subscribe((isVerified: boolean) => {
    //     this.isVerified = isVerified;
    //   });
    // } else {
    //   this.paymentMethodId = null;
    // }

    this.disabledNextStep();
    // this.generalService.currentlyLang.subscribe(lang => {
    //   this.switchLanguage(lang);
    // });
    // this.generalService.currentlyLang.subscribe(lang => {
    //   this.currentlyLang = lang;
    // });
    this.receiptService.blockPayMethod.subscribe((data: boolean) => {
      this.disabledPayMethod = data;
      console.log(this.disabledPayMethod)
    });
    this.receiptService.createNewEvent.subscribe(() => {
      this.customerInfoTitle = '';
      this.userInfoGroup.reset();
      this.refreshRequiredFormFields();
      this.customerFound = true;
    });
    console.log(this.userInfoGroup.value)
    this.filterOptionForCustomerSearch();
    console.log('this.paymentMethodId', this.paymentMethodId);
  }

  /**
   * Autocomplete for customer search
   */
  filterOptionForCustomerSearch() {
    console.log(this.userInfoGroup)

    this.filteredOptions = this.userInfoGroup.controls.addresses.get('city').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.cities.filter(city => city['CityName'].toLowerCase().includes(filterValue));
  }
  updateCustomerInfo() {
    if (typeof (this.customerInfo) != 'undefined' && this.customerInfo) {
      this.changeValue(this.customerInfo);
      this.customerFound = false;
    }
  }
  disabledNextStep() {
    this.checkRequiredNameFields();
    this.userInfoGroup.controls.customerMainInfo.valueChanges.subscribe(data => {
      this.checkRequiredNameFields();
      sessionStorage.setItem('firstName', data.firstName);
      sessionStorage.setItem('lastName', data.lastName);
      sessionStorage.setItem('company', data.company);

    });
  }
  checkRequiredNameFields() {
    const firstNameControl = this.userInfoGroup.controls.customerMainInfo.get('firstName');
    const lastNameControl = this.userInfoGroup.controls.customerMainInfo.get('lastName');
    const companyControl = this.userInfoGroup.controls.customerMainInfo.get('company');
    if (firstNameControl.value !== '' || lastNameControl.value !== '' || companyControl.value !== '') {
      this.requiredField = false;
      if (this.paymentMethodId !== 3) {
        this.nextStepDisabled = false;
      } if (this.paymentMethodId === 3 && this.isVerified === true) {
        this.nextStepDisabled = false;
      } else if (this.paymentMethodId === 3 && this.isVerified === false) {
        this.nextStepDisabled = true;
      }
    } else {
      this.requiredField = true;
      this.nextStepDisabled = true;
    }
  }
  getCustomerInfo() {
    // this.receitService.customerInfoValue.subscribe(customer => {
    //   this.customerInfo = customer;
    //   if (typeof (this.customerInfo) != 'undefined') {
    //     console.log('Info', this.customerInfo);

    //   }
    // }, error => {
    //   console.log(error)
    // }
    // );
  }
  changeValue(customer) {
    if (customer !== undefined) {
      this.receiptService.setStep(1);
      this.customerInfoTitle = customer.CustomerInfoForReceiept[0].FileAs;
      console.log(this.customerInfoTitle);
      this.userInfoGroup.controls.customerMainInfo.patchValue({
        customerId: customer.CustomerInfoForReceiept[0].CustomerId,
        firstName: customer.CustomerInfoForReceiept[0].fname,
        lastName: customer.CustomerInfoForReceiept[0].lname,
        company: customer.CustomerInfoForReceiept[0].Company,
        customerType: customer.CustomerInfoForReceiept[0].CustomerType,
        title: customer.CustomerInfoForReceiept[0].Title,
        gender: customer.CustomerInfoForReceiept[0].Gender,
        tZ: customer.CustomerInfoForReceiept[0].CustomerCode,
        spouseName: customer.CustomerInfoForReceiept[0].SpouseName,
        fileAs: customer.CustomerInfoForReceiept[0].FileAs,
        birthday: moment(customer.CustomerInfoForReceiept[0].BirthDate).format('YYYY-MM-DD'),
        afterSunset: customer.CustomerInfoForReceiept[0].AfterSunset1,
      });
      this.receiptService.changeCustomerName(`${customer.CustomerInfoForReceiept[0].fname} ${customer.CustomerInfoForReceiept[0].lname}`);
    }
    console.log('work');
  }
  refreshRequiredFormFields() {
    this.userInfoGroup.patchValue({
      customerId: null,
      firstName: '',
      lastName: '',
      company: ''
    });
  }
  creditCardModalOpen(paymentMethodId: number) {
    // console.log(this.isVerified);
    // console.log(this.selectedPayMethod);
    this.paymentMethodId = paymentMethodId;
    if (paymentMethodId === undefined) {
      this.paymentMethodId = Number(localStorage.getItem('paymenthMethod'));
    }
    if (this.paymentMethodId === 3) {
      this.dialog.open(CreditCardComponent, { width: '350px' });
      console.log(this.paymentMethodId);
    } else {
      return;
    }
  }
  checkPayType(payType: number) {
    this.paymentMethodId = payType;
    this.disabledNextStep();
    this.receiptService.paymentMethod.next(payType);
    if (payType === 3) {
      console.log('nextStepDisabled', this.nextStepDisabled)

      this.receiptService.payByCreditCard.next(true);
    } else {
      console.log('nextStepDisabled', this.nextStepDisabled)

      this.receiptService.payByCreditCard.next(false);
    }
    console.log('nextStepDisabled', this.nextStepDisabled)

  }
  // ДИНАМИЧЕСКОЕ ДОБАВЛЕНИЕ ПОЛЕЙ ВВОДА

  // phone: this.fb.array([
  //   this.fb.control('')
  // ])

  get phones() {
    return this.userInfoGroup.get('phones') as FormArray;
  }
  get emails() {
    return this.userInfoGroup.get('emails') as FormArray;
  }
  addPhone() {
    this.phones.push(this.fb.group({
      PhoneTypeId: [2],
      phone: ['']
    }));
  }
  addMail() {
    const firstName = this.userInfoGroup.controls.customerMainInfo.get('firstName').value;
    const lastName = this.userInfoGroup.controls.customerMainInfo.get('lastName').value;
    const company = this.userInfoGroup.controls.customerMainInfo.get('company').value;
    this.emails.push(this.fb.group({
      emailname: [`${firstName} ${lastName} ${company}`],
      email: [''],
    }));
  }
  deletePhone(i) {
    if (i === 0) {
      return;
    } else {
      this.phones.removeAt(i);
    }
  }
  deleteEmail(i) {
    if (i === 0) {
      return;
    } else {
      this.emails.removeAt(i);
    }
  }
  submit() {
    this.userInfoGroup.value.birthday = moment(this.userInfoGroup.value.birthday).format('YYYY-MM-DD')
    // tslint:disable-next-line: max-line-length
    this.receiptService.changeCustomerName(`${this.userInfoGroup.controls.customerMainInfo.get('firstName').value} ${this.userInfoGroup.controls.customerMainInfo.get('lastName').value}`);
    this.receiptService.newReceipt.customerInfo.customermaininfo = this.userInfoGroup.get('customerMainInfo').value;
    this.receiptService.newReceipt.customerInfo.phones = this.userInfoGroup.get('phones').value;
    this.receiptService.newReceipt.customerInfo.emails = this.userInfoGroup.get('emails').value;
    this.receiptService.newReceipt.customerInfo.addresses = this.userInfoGroup.get('addresses').value;
    this.receiptService.newReceipt.customerInfo.groups = this.userInfoGroup.get('groups').value;
    this.receiptService.newReceipt.PaymentType = this.payMath.value;


    // const customermaininfo = this.userInfoGroup.get('customerMainInfo').value;
    // this.receiptService.customerMainInfoForCustomerInfo(customermaininfo)
    const paymentMethodId = this.payMath;
    this.receiptService.paymentMethod.next(paymentMethodId.value);
    localStorage.setItem('paymenthMethod', paymentMethodId.value);
    console.log('form.value', this.userInfoGroup.value);
    console.log('this.receiptService.newReceipt', this.receiptService.newReceipt);
    this.receiptService.setStep(3);
  }
  getItemsFromSessionStorage(key) {
    if (sessionStorage.getItem(key)) {
      return sessionStorage.getItem(key);
    } else {
      return '';
    }
  }
  getItemsFromLocalStorage(item) {
    if (localStorage.getItem(item)) {
      return localStorage.getItem(item);
    } else {
      return '';
    }

  }
  getPayMethFromLocalStorage() {
    if (localStorage.getItem('paymenthMethod')) {
      if (localStorage.getItem('paymenthMethod') === '3') {
        this.paymentMethodId = Number(localStorage.getItem('paymenthMethod'));
      } else {
        this.paymentMethodId = Number(localStorage.getItem('paymenthMethod'));
      }
    } else {
      this.paymentMethodId = null;
    }
  }
  getPaymentTypes() {
    this.generalService.receiptData.subscribe(data => {
      this.paymentMethods = data['PaymentTypes'];
    });
  }
  // nextStepIsAvl(payMeth: number) {
  //   if (payMeth === 3) {
  //     if (this.userInfoGroup.invalid === true && this.isVerified === false ||
  //       this.userInfoGroup.invalid === true && this.isVerified === true ||
  //       this.userInfoGroup.invalid === false && this.isVerified === false) {
  //       return this.nextStepDisabled = true;
  //     } else {
  //       return this.nextStepDisabled = false;
  //     }
  //   } else {
  //     if (this.userInfoGroup.invalid) {
  //       return this.nextStepDisabled = true;
  //     } else {
  //       return this.nextStepDisabled = false;
  //     }
  //   }

  // }
  ngOnDestroy() {
    // this.subs.unsubscribe();
    console.log("ngOnDestroy")
  }
}
