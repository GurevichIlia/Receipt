import { Observable, Subscription } from 'rxjs';
import { CreditCardService } from '../credit-card/credit-card.service';
import { Component, OnInit, Input, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { ReceiptsService } from '../../services/receipts.service';
import { FormArray, Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { GeneralSrv } from 'src/app/services/GeneralSrv.service';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { startWith, map, debounceTime } from 'rxjs/operators';

export interface Group {
  GroupId: number;
};

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() customerInfo: object;
  @Input() currentlyLang: string;
  @Input() cities: any[];
  step: number;
  myControl = new FormControl();
  filteredOptions$: Observable<any[]>;
  filterCustTitle$: Observable<any[]>;
  paymentMethodId = null;
  userInfoGroup: FormGroup;
  groups: any[] = [];
  paymentMethods: object[] = [];
  // customerInfo: object;
  customerInfoTitle: string;
  showMoreInfo = false;
  requiredField = true;
  disabledPayMethod = false;
  clickToBtnCreateNew = false;
  customerTitle: any[] = [];
  // tslint:disable-next-line: max-line-length
  pattern = '^(((0[1-9]|[12][0-9]|30)[-/]?(0[13-9]|1[012])|31[-/]?(0[13578]|1[02])|(0[1-9]|1[0-9]|2[0-8])[-/]?02)[-/]?[0-9]{4}|29[-/]?02[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$';
  subs;
  // selectedPayMethod: number;
  isVerified = false;
  nextStepDisabled = true;
  // currentlyLang: string;
  // payMath: FormControl;
  foundCustomerEmails: object[] = [];
  foundCustomerPhones: object[] = [];
  customerTypes: any[] = [];
  selectedGroups: Group[] = [];
  private subscriptions: Subscription = new Subscription();
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private creditCardService: CreditCardService
  ) {
    // tslint:disable-next-line: max-line-length
    // this.payMath = new FormControl({ value: localStorage.getItem('paymenthMethod') ? Number(localStorage.getItem('paymenthMethod')) : null, disabled: this.disabledPayMethod }, [Validators.required])
    // this.firstName = '';
    // this.lastName = '';
    // this.customerId = null
    // tslint:disable-next-line: max-line-length
    const emailName = `${this.getItemsFromSessionStorage('firstName')} ${this.getItemsFromSessionStorage('lastName')} ${this.getItemsFromSessionStorage('company')}`;
    // this.paymentMethodId = localStorage.getItem('paymenthMethod') ? Number(localStorage.getItem('paymenthMethod')) : null;
    this.userInfoGroup = this.fb.group({
      customerMainInfo: this.fb.group({
        customerId: [null],
        firstName: [this.getItemsFromSessionStorage('firstName'), Validators.maxLength(20)],
        lastName: [this.getItemsFromSessionStorage('lastName'), Validators.maxLength(20)],
        company: [this.getItemsFromSessionStorage('company'), Validators.maxLength(20)],
        // tslint:disable-next-line: max-line-length
        customerType: [this.setCustomerType()],
        title: [this.getItemsFromSessionStorage('title')],
        gender: [this.getItemsFromSessionStorage('gender')],
        tZ: [this.getItemsFromSessionStorage('tZ')],
        spouseName: [this.getItemsFromSessionStorage('spouseName')],
        fileAs: [this.getItemsFromSessionStorage('fileAs')],
        birthday: [moment(this.getItemsFromSessionStorage('birthday')).format('YYYY-MM-DD')],
        afterSunset: [this.getItemsFromSessionStorage('afterSunset')],
      }),
      phones: this.fb.array([
        this.fb.group({
          PhoneTypeId: [2],
          phone: ['']
        })
      ]),
      emails: this.fb.array([
        this.fb.group({
          emailname: [''],
          email: ['', Validators.email],
        })
      ]),
      addresses: this.fb.group({
        city: [''],
        street: [''],
        zip: [''],
        addresstypeid: ['']
      }),
      groups: ['']
    });

  }
  get customerInfoGroup() {
    return this.userInfoGroup.get('customerMainInfo');
  }
  get firstName() {
    return this.userInfoGroup.controls.customerMainInfo.get('firstName');
  }
  get lastName() {
    return this.userInfoGroup.controls.customerMainInfo.get('lastName');
  }
  get company() {
    return this.userInfoGroup.controls.customerMainInfo.get('company');
  }
  get customerType() {
    return this.userInfoGroup.controls.customerMainInfo.get('customerType');
  }
  get title() {
    return this.userInfoGroup.controls.customerMainInfo.get('title');
  }
  get tZ() {
    return this.userInfoGroup.controls.customerMainInfo.get('tZ');
  }
  get gender() {
    return this.userInfoGroup.controls.customerMainInfo.get('gender');
  }
  get spouseName() {
    return this.userInfoGroup.controls.customerMainInfo.get('spouseName');
  }
  get fileAs() {
    return this.userInfoGroup.controls.customerMainInfo.get('fileAs');
  }
  get birthday() {
    return this.userInfoGroup.controls.customerMainInfo.get('birthday');
  }
  get afterSunset() {
    return this.userInfoGroup.controls.customerMainInfo.get('afterSunset');
  }
  get group() {
    return this.userInfoGroup.get('groups');
  }
  setCustomerType() {
    let custType;
    if (this.getItemsFromSessionStorage('customerType') === '') {
      custType = '';
    } else {
      custType = +this.getItemsFromSessionStorage('customerType');
    }
    return custType;
  }
  ngAfterViewInit() {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
  }
  ngOnChanges() {
    if (this.customerInfo !== undefined) {
      if (this.customerInfo['CustomerEmails'] !== []) {
        this.foundCustomerEmails = this.customerInfo['CustomerEmails'];
      }
      if (this.customerInfo['CustomerMobilePhones'] !== []) {
        this.foundCustomerPhones = this.customerInfo['CustomerMobilePhones'];
      }
    }
    this.changeCustomerInfoAfterUserIsFound(this.customerInfo);
    console.log('isVerified ;', this.isVerified);
    console.log('nextStepDisabled', this.nextStepDisabled);
    console.log(this.foundCustomerEmails, this.foundCustomerPhones);

    // this.creditCardService.currentlyCreditCardVerified.subscribe((isVerified: boolean) => {
    //   this.isVerified = isVerified;
    //   console.log('this.isVerified', this.isVerified);
    //   this.disabledNextStep();
    // });
  }

  ngOnInit() {
    // console.log('this.payMath', this.payMath)
    this.subscriptions.add(this.generalService.receiptData.subscribe(data => {
      this.customerTitle = data['CustomerTitle'];
    }));
    this.subscriptions.add(this.generalService.receiptData.subscribe(data => {
      this.customerTypes = data['GetCustomerTypes'];
      console.log(this.customerTypes);
    }));
    this.subscriptions.add(this.receiptService.currentlyStep.subscribe(step => this.step = step));

    this.getPaymentTypes();
    this.getPayMethFromLocalStorage();

    this.disabledNextStep();
    this.customerTitleAutoCompl();

    // this.generalService.currentlyLang.subscribe(lang => {
    //   this.switchLanguage(lang);
    // });
    // this.generalService.currentlyLang.subscribe(lang => {
    //   this.currentlyLang = lang;
    // });
    this.subscriptions.add(this.userInfoGroup.valueChanges.pipe(debounceTime(1000))
      .subscribe(data => {
        this.setItemToSessionStorage('firstName', data.customerMainInfo.firstName);
        this.setItemToSessionStorage('lastName', data.customerMainInfo.lastName);
        this.setItemToSessionStorage('company', data.customerMainInfo.company);
        this.setItemToSessionStorage('customerType', data.customerMainInfo.customerType);
        this.setItemToSessionStorage('title', data.customerMainInfo.title);
        this.setItemToSessionStorage('gender', data.customerMainInfo.gender);
        this.setItemToSessionStorage('tZ', data.customerMainInfo.tZ);
        this.setItemToSessionStorage('spouseName', data.customerMainInfo.spouseName);
        this.setItemToSessionStorage('fileAs', data.customerMainInfo.fileAs);
        this.setItemToSessionStorage('afterSunset', data.customerMainInfo.afterSunset);
      }));
    // this.receiptService.blockPayMethod.subscribe((data: boolean) => {
    //   this.disabledPayMethod = data;
    //   console.log(this.disabledPayMethod)
    // });
    this.subscriptions.add(this.receiptService.createNewEvent.subscribe(() => {
      this.customerInfoTitle = '';
      this.userInfoGroup.reset();
      sessionStorage.clear();
      this.showMoreInfo = false;
      this.resetEmails();
      this.resetPhones();
      this.resetGroup();
      this.refreshRequiredFormFields();
      this.disabledNextStep();
    }));
    console.log(this.userInfoGroup.value)
    // this.filterOptionForCustomerSearch();
    setTimeout(() => {
      this.cityNameAutocompl();
    }, 2000);
  }
  /**
   * Autocomplete for city list in customer info.
   */
  cityNameAutocompl() {
    this.filteredOptions$ = this.userInfoGroup.controls.addresses.get('city').valueChanges
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
    return this.cities.filter(city => city['CityName'].toLowerCase().includes(filterValue));
  }
  updateCustomerInfo() {
    if (typeof (this.customerInfo) != 'undefined' && this.customerInfo) {
      this.changeCustomerInfoAfterUserIsFound(this.customerInfo);
      this.showMoreInfo = false;
    }
  }
  disabledNextStep() {
    this.checkRequiredNameFields();
    this.subscriptions.add(this.userInfoGroup.controls.customerMainInfo.valueChanges
      .subscribe(data => {
        this.checkRequiredNameFields();
      }));
  }
  checkRequiredNameFields() {
    const firstNameControl = this.firstName.value;
    const lastNameControl = this.lastName.value;
    const companyControl = this.company.value;
    if (firstNameControl !== '' || lastNameControl !== '' || companyControl !== '') {
      if (firstNameControl !== null || lastNameControl !== null || companyControl !== null) {
        this.requiredField = false;
      } else {
        this.requiredField = true;
        this.nextStepDisabled = true;
      }
    } else {
      this.requiredField = true;
      this.nextStepDisabled = true;
    }
  }
  customerTitleAutoCompl() {
    this.filterCustTitle$ = this.userInfoGroup.controls.customerMainInfo.get('title').valueChanges
      .pipe(
        debounceTime(500),
        startWith(''),
        map(value => this.filter(value))
      );
  }
  private filter(value: string): string[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();
    return this.customerTitle.filter(title => title['TitleHeb'].toLowerCase().includes(filterValue));

  }
  resetForm() {
    // this.userInfoGroup.reset('');
  }
  changeCustomerInfoAfterUserIsFound(customer) {
    if (customer !== undefined) {
      const custInfo = customer.CustomerInfoForReceiept[0];
      this.receiptService.customer.next(false);
      this.receiptService.setStep(1);
      this.customerInfoTitle = `${custInfo.FileAs} ${custInfo.CustomerId}`;
      console.log(this.customerInfoTitle);

      this.userInfoGroup.controls.customerMainInfo.patchValue({
        customerId: custInfo.CustomerId,
        firstName: custInfo.fname,
        lastName: custInfo.lname,
        company: custInfo.Company,
        customerType: custInfo.CustomerType,
        title: custInfo.Title,
        gender: custInfo.Gender,
        tZ: custInfo.CustomerCode,
        spouseName: custInfo.SpouseName,
        fileAs: custInfo.FileAs,
        birthday: moment(customer.CustomerInfoForReceiept[0].BirthDate).format('DD/MM/YYYY'),
        afterSunset: custInfo.AfterSunset1,
      });
      if (customer.CustomerAddresses.length > 0) {

        this.userInfoGroup.controls.addresses.patchValue({
          city: customer.CustomerAddresses[0].CityName,
          street: customer.CustomerAddresses[0].Street,
          zip: customer.CustomerAddresses[0].Zip,
          addresstypeid: customer.CustomerAddresses[0].AddressTypeId

        });
      } else {
        this.userInfoGroup.controls.addresses.patchValue({
          city: '',
          street: '',
          zip: '',
          addresstypeid: ''
        });
      }
      if (this.foundCustomerPhones.length > 0) {
        this.phones.controls[0].patchValue({
          PhoneTypeId: this.foundCustomerPhones[0]['PhoneTypeId'],
          phone: this.foundCustomerPhones[0]['Phone'],
        });
        this.foundCustomerPhones = [];
      } else {
        this.phones.controls[0].patchValue({
          PhoneTypeId: 2,
          phone: ''
        });
      }
      if (this.foundCustomerEmails.length > 0) {
        this.emails.controls[0].patchValue({
          emailname: this.foundCustomerEmails[0]['EmailName'],
          email: this.foundCustomerEmails[0]['Email'],
        });
        this.foundCustomerEmails = [];
      } else {
        this.emails.controls[0].patchValue({
          emailname: custInfo.fname,
          email: ''
        });
      }
    }
    // this.disabledNextStep();
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
    this.emails.push(this.fb.group({
      emailname: [''],
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
  addCUstomerInfoToReceipt() {
    // tslint:disable-next-line: max-line-length
    let birthday = moment(this.birthday.value).format('DD/MM/YYYY');
    // birthday.patchValue(moment(birthday).format('YYYY-MM-DD'));
    if (birthday === 'Invalid date') {
      birthday = '';
    }
    this.setItemToSessionStorage('birthday', birthday);
    // tslint:disable-next-line: max-line-length
    if (this.firstName.value === null) {
      this.firstName.patchValue('');
    }
    if (this.lastName.value === null) {
      this.lastName.patchValue('');
    }
    this.receiptService.changeCustomerName(`${this.firstName.value} ${this.lastName.value}`);
    this.receiptService.setCustomerMainfInfo(this.userInfoGroup.get('customerMainInfo').value);
    this.receiptService.newReceipt.customerInfo.customermaininfo.birthday = birthday;
    this.receiptService.setPhones(this.checkEmptyPhone());
    this.receiptService.setEmails(this.checkEmptyEmail());
    this.receiptService.setAdresses(this.userInfoGroup.get('addresses').value);
    this.receiptService.customerEmails.next(this.checkEmptyEmail());
    this.receiptService.addGroupsToReceipt(this.addGroups());

    // this.receiptService.newReceipt.customerInfo.groups = this.userInfoGroup.get('groups').value;
    // this.receiptService.newReceipt.PaymentType = this.payMath.value;


    // const customermaininfo = this.userInfoGroup.get('customerMainInfo').value;
    // this.receiptService.customerMainInfoForCustomerInfo(customermaininfo)
    // const paymentMethodId = this.payMath;
    // this.receiptService.paymentMethod.next(paymentMethodId.value);
    // localStorage.setItem('paymenthMethod', paymentMethodId.value);
    console.log('form.value', this.userInfoGroup.value);
    console.log('this.receiptService.newReceipt', this.receiptService.newReceipt);

  }
  submit() {
    this.addCUstomerInfoToReceipt()
    this.receiptService.setStep(3);
  }
  openStore() {
    this.addCUstomerInfoToReceipt()
    this.receiptService.setStep(2);
  }
  getItemsFromSessionStorage(key) {
    if (sessionStorage.getItem(key)) {
      return sessionStorage.getItem(key);
    } else {
      return '';
    }
  }
  // getItemsFromLocalStorage(item) {
  //   if (localStorage.getItem(item)) {
  //     return localStorage.getItem(item);
  //   } else {
  //     return;
  //   }

  // }
  setItemToSessionStorage(key: string, value: string) {
    if (value != '' && value != null) {
      sessionStorage.setItem(key, value);
    } else {
      return;
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
    this.subscriptions.add(this.generalService.receiptData.subscribe(data => {
      this.paymentMethods = data['PaymentTypes'];
    }));
  }

  checkEmptyPhone() {
    let phones = this.phones.value.filter(phone => phone.phone !== '');
    phones = phones.filter(phone => phone.phone !== null);
    return phones;
  }
  checkEmptyEmail() {
    let emails = this.emails.value.filter(email => email.email !== '');
    emails = emails.filter(email => email.email !== null);
    return emails;
  }
  resetPhones() {
    for (let i = this.phones.value.length; i > 0; i--) {
      this.deletePhone(i);
    }
  }
  resetEmails() {
    for (let i = this.emails.value.length; i > 0; i--) {
      this.deleteEmail(i);
    }
  }
  resetGroup() {
    this.group.patchValue('');
  }
  ngOnDestroy() {
    console.log('CUSTOMER INFO SUBSCRIBE', this.subscriptions);
    this.subscriptions.unsubscribe();
    console.log('CUSTOMER INFO SUBSCRIBE On Destroy', this.subscriptions);
  }
  pickCustomerTypeId(typeId: number) {
    for (const customerType of this.customerTypes) {
      if (customerType['TypeId'] === typeId) {
        this.customerType.patchValue(customerType['TypeId']);
      }
    }
  }
  addGroups() {
    if (this.group.value.length > 0) {
      for (const selGroup of this.group.value) {
        const selectedGroup: Group = {
          GroupId: selGroup
        };
        this.selectedGroups.push(selectedGroup);
      }
      return this.selectedGroups;
    } else {
      return [];
    }

  }

}
