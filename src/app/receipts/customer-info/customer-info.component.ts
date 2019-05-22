import { Component, OnInit, Input, OnChanges, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ReceiptsService } from '../../services/receipts.service';
import { FormArray, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { CreditCardComponent } from '../credit-card/credit-card.component';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() customerInfo: object;
  @Input() currentlyLang: string;
  // @ViewChild('PaymentMethod') payMethodId: any;
  paymentMethodId = null;
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
  selectedPayMethod: number;
  // currentlyLang: string;
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {

    // this.firstName = '';
    // this.lastName = '';
    // this.customerId = null
    // tslint:disable-next-line: max-line-length
    this.userInfoGroup = this.fb.group({
      name: this.fb.group({
        customerId: [null],
        firstName: [this.checkLocalStorage('firstName')],
        lastName: [''],
        company: [''],
      }),
      // tslint:disable-next-line: max-line-length
      payMath: [{ value: localStorage.getItem('paymenthMethod') ? Number(localStorage.getItem('paymenthMethod')) : '', disabled: this.disabledPayMethod }, [Validators.required]],
      moreInfo: this.fb.group({
        customerType: [''],
        title: [''],
        gender: [''],
        tZ: [''],
        spouseName: [''],
        fileAs: [''],
        birthday: [''],
        afterSunset: [false],
      }),
      mobilePhone: this.fb.array([
        this.fb.control('')
      ]),
      email: this.fb.array([
        this.fb.control('')
      ]),
      adress: this.fb.group({
        city: [''],
        street: [''],
        zip: ['']
      }),
      groups: []
    });
    // this.groups = this.customerInfo['QuickGeneralGroupList'];
  }
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
  ngOnChanges() {
    this.changeValue(this.customerInfo);

    console.log('OnChanges', '11111');
  }
  ngOnInit() {
    // this.generalService.currentlyLang.subscribe(lang => {
    //   this.switchLanguage(lang);
    // });
    // this.generalService.currentlyLang.subscribe(lang => {
    //   this.currentlyLang = lang;
    // });
    this.generalService.receiptData.subscribe(data => {
      this.paymentMethods = data['PaymentTypes'];
    });
    this.receiptService.blockPayMethod.subscribe((data: boolean) => {
      this.disabledPayMethod = data;
      console.log(this.disabledPayMethod)
    });
    this.checkRequiredNameFields();
    this.receiptService.createNewEvent.subscribe(() => {
      this.customerInfoTitle = '';
      this.userInfoGroup.reset();
      this.refreshRequiredFormFields();
      this.customerFound = true;
    });
    console.log(this.userInfoGroup.value)

  }
  updateCustomerInfo() {
    if (typeof (this.customerInfo) != 'undefined' && this.customerInfo) {
      this.changeValue(this.customerInfo);
      this.customerFound = false;
    }
  }
  checkRequiredNameFields() {
    let name;
    name = this.userInfoGroup.get('name');
    name.valueChanges.subscribe(data => {
      console.log(data)
      if (data.firstName !== '' || data.lastName !== '' || data.company !== '') {
        this.requiredField = false;
      } else {
        this.requiredField = true;
      }
      localStorage.setItem('firstName', data.firstName);
      localStorage.setItem('lastName', data.lastName);
      localStorage.setItem('company', data.company);
    }
    );

    console.log(name)
    console.log('this.requiredField ', this.requiredField);
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
      this.userInfoGroup.patchValue({
        name: {
          customerId: customer.CustomerInfoForReceiept[0].CustomerId,
          firstName: customer.CustomerInfoForReceiept[0].fname,
          lastName: customer.CustomerInfoForReceiept[0].lname,
          company: customer.CustomerInfoForReceiept[0].Company,
        },
        moreInfo: {
          customerType: customer.CustomerInfoForReceiept[0].CustomerType,
          title: customer.CustomerInfoForReceiept[0].Title,
          gender: customer.CustomerInfoForReceiept[0].Gender,
          t2: customer.CustomerInfoForReceiept[0].CustomerCode,
          spouseName: customer.CustomerInfoForReceiept[0].SpouseName,
          fileAs: customer.CustomerInfoForReceiept[0].FileAs,
          birthday: moment(customer.CustomerInfoForReceiept[0].BirthDate).format('YYYY-MM-DD'),
          afterSunset: customer.CustomerInfoForReceiept[0].AfterSunset1,
        },
      });
      this.receiptService.changeCustomerName(`${customer.CustomerInfoForReceiept[0].fname} ${customer.CustomerInfoForReceiept[0].lname}`);
    }
    console.log('work');
  }
  refreshRequiredFormFields() {
    this.userInfoGroup.patchValue({
      name: {
        customerId: null,
        firstName: '',
        lastName: '',
        company: ''
      }
    });
  }
  creditCardModalOpen(paymentMethodId) {
    this.selectedPayMethod = paymentMethodId;
    if (paymentMethodId === undefined) {
      paymentMethodId = Number(localStorage.getItem('paymenthMethod'));
    }
    if (paymentMethodId === 3) {
      this.dialog.open(CreditCardComponent, { width: '350px' });
    } else {
      return;
    }
  }
  checkPayType(payType: number) {
    this.receiptService.paymentMethod.next(payType);
    if (payType === 3) {
      this.receiptService.payByCreditCard.next(true);
    } else {
      this.receiptService.payByCreditCard.next(false);
    }
    console.log(this.receiptService.payByCreditCard);
  }
  // ДИНАМИЧЕСКОЕ ДОБАВЛЕНИЕ ПОЛЕЙ ВВОДА

  // phone: this.fb.array([
  //   this.fb.control('')
  // ])

  // get phone() {
  //   return this.creditCardForm.get('phone') as FormArray;
  // }
  // addPhone() {
  //   this.phone.push(this.fb.control(''));
  // }
  // delete(i) {
  //   if (i === 0) {
  //     return;
  //   } else {
  //     this.phone.removeAt(i);
  //   }

  // }
  submit() {
    this.userInfoGroup.value.birthday = moment(this.userInfoGroup.value.birthday).format('YYYY-MM-DD')
    this.receiptService.changeCustomerName(`${this.userInfoGroup.value.name.firstName} ${this.userInfoGroup.value.name.lastName}`);
    this.receiptService.newReceipt.customerInfo = this.userInfoGroup.value;
    const paymentMethodId = this.userInfoGroup.get('payMath');
    this.receiptService.paymentMethod.next(paymentMethodId.value);
    localStorage.setItem('paymenthMethod', paymentMethodId.value);
    console.log('form.value', this.userInfoGroup.value);
    console.log('this.receiptService.newReceipt', this.receiptService.newReceipt);
    this.receiptService.setStep(3);
  }
  checkLocalStorage(key) {
    if (localStorage.getItem(key)) {
      return localStorage.getItem(key);

    }

  }

  ngOnDestroy() {
    // this.subs.unsubscribe();
    console.log("ngOnDestroy")
  }
}
