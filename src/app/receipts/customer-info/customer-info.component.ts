import { Component, OnInit, Input, OnChanges, ViewChild, OnDestroy } from '@angular/core';
import { ReceiptsService } from '../../services/receipts.service';
import { FormArray, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { CreditCardComponent } from '../credit-card/credit-card.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() customerInfo: object;
  @Input() clickToBtnCreateNew: boolean;
  @ViewChild('PaymentMethod') paymentMethodId: any;
  userInfoGroup: FormGroup;
  groups: any[] = [];
  paymentMethods: object[] = [];
  // customerInfo: object;
  customerInfoTitle: string;
  customerFound = false;
  pattern = '^(((0[1-9]|[12][0-9]|30)[-/]?(0[13-9]|1[012])|31[-/]?(0[13578]|1[02])|(0[1-9]|1[0-9]|2[0-8])[-/]?02)[-/]?[0-9]{4}|29[-/]?02[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$';
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private dialog: MatDialog,
    private fb: FormBuilder

  ) {
    // this.firstName = '';
    // this.lastName = '';
    // this.customerId = null
    // tslint:disable-next-line: max-line-length
    this.userInfoGroup = this.fb.group({
      name: this.fb.group({
        customerId: [''],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        company: [''],
      }),
      payMath: ['', [Validators.required]],
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
  ngOnChanges() {
    console.log('OnChanges', this.customerInfo);
    if (typeof (this.customerInfo) != 'undefined' && this.customerInfo) {
      this.changeValue(this.customerInfo);
      this.customerFound = true;
    }
    if (this.clickToBtnCreateNew) {
      this.customerInfoTitle = '';
      this.userInfoGroup.reset();
      this.customerFound = false;
    }
    console.log('OnChanges', this.clickToBtnCreateNew);

  }
  ngOnInit() {
    this.getCustomerInfo();
    this.generalService.receiptData.subscribe(data => {
      this.paymentMethods = data['PaymentTypes'];
    });
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
        birthday: customer.CustomerInfoForReceiept[0].BirthDate,
        afterSunset: customer.CustomerInfoForReceiept[0].AfterSunset1,
      },
    });
    console.log('work');
  }
  submit(form: NgForm) {
    this.receiptService.newReceipt.customerInfo = form.value;
    console.log('form.value', form.value );
    console.log('this.receiptService.newReceipt', this.receiptService.newReceipt)
  }
  open() {
    this.dialog.open(CreditCardComponent, { width: '350px' });

  }
  creditCardModalOpen() {
    if (this.paymentMethodId.value === 3) {
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
    console.log(this.receiptService.payByCreditCard)
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
  ngOnDestroy() {
    console.log('ngOnDestroy', 'customer info')
  }
}
