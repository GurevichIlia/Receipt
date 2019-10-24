import { Customermaininfo } from './../../models/customermaininfo.model';
import { Component, OnInit, Input, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';

import { Observable, Subscription, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { ReceiptsService } from '../services/receipts.service';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { PaymentsService } from './../../grid/payments.service';

import * as moment from 'moment';

import { CustomerType } from 'src/app/models/customerType.model';
import { GetCustomerReceipts, CustomerAddresses } from 'src/app/models/customer-info-by-ID.model';
import { CustomerInfoService, CustomerInfoByIdForCustomerInfoComponent } from './customer-info.service';
import { MainDetails, CustomerPhones, CustomerEmails } from 'src/app/models/fullCustomerDetailsById.model';
import { CustomerTitle } from 'src/app/models/globalData.model';
import { ReceiptGLobalData } from 'src/app/models/receiptGlobalData.model';
import { Phones } from 'src/app/models/phones.model';
import { Emails } from 'src/app/models/emails.model';
import { Addresses } from 'src/app/models/addresses.model';
import { CustomerGroupById } from 'src/app/models/customerGroupById.model';

export interface Group {
  GroupId: number;
};
@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit, OnChanges, OnDestroy {
  cities: any[];
  customerTitle: CustomerTitle[];;
  customerTypes: CustomerType[];
  @Output() toNewPayment = new EventEmitter();
  @Output() toNewCustomerDetails = new EventEmitter();
  customerInfoById: CustomerInfoByIdForCustomerInfoComponent;
  step: number;
  // cityAutoCompleteControl = new FormControl();
  // titleAutoCompleteControl = new FormControl();
  filteredCity$: Observable<any[]>;
  filterCustTitle$: Observable<CustomerTitle[]>;
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
  // customerTitle: any[] = [];
  // tslint:disable-next-line: max-line-length
  subs;
  // selectedPayMethod: number;
  isVerified = false;
  nextStepDisabled = true;
  currentLang: string;


  selectedGroups: Group[] = [];
  currentRoute: string;
  private subscriptions: Subscription = new Subscription();
  paymentsListData: GetCustomerReceipts;

  globalReceiptData: ReceiptGLobalData;

  customerPhones: CustomerPhones[];
  customerEmails: CustomerEmails[];
  customerAddress: CustomerAddresses[];
  customerDetails: Customermaininfo[] | MainDetails[];

  customerGroupList: CustomerGroupById[]

  customer: {
    customermaininfo: Customermaininfo;
    phones: Phones[];
    emails: Emails[];
    addresses: Addresses;
    groups: Group[];

  }

  subscription$ = new Subject();
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private fb: FormBuilder,
    private activatedRoute: Router,
    private paymentsService: PaymentsService,
    private customerInfoService: CustomerInfoService
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
        fname: [this.getItemsFromSessionStorage('firstName'), Validators.maxLength(20)],
        lname: [this.getItemsFromSessionStorage('lastName'), Validators.maxLength(20)],
        company: [this.getItemsFromSessionStorage('company'), Validators.maxLength(20)],
        // tslint:disable-next-line: max-line-length
        customerType: [this.setCustomerType()],
        title: [this.getItemsFromSessionStorage('title')],
        gender: [this.getItemsFromSessionStorage('gender')],
        customerCode: [this.getItemsFromSessionStorage('tZ')],
        spouseName: [this.getItemsFromSessionStorage('spouseName')],
        fileAs: [this.getItemsFromSessionStorage('fileAs')],
        birthday: [moment(this.getItemsFromSessionStorage('birthday')).format('YYYY-MM-DD')],
        afterSunset1: [this.getItemsFromSessionStorage('afterSunset')],
      }),
      phones: this.fb.array([
        this.fb.group({
          phoneTypeId: [2],
          phoneNumber: ['']
        })
      ]),
      emails: this.fb.array([
        this.fb.group({
          emailName: [''],
          email: ['', Validators.email],
        })
      ]),
      address: this.fb.group({
        cityName: [''],
        street: [''],
        street2: [''],
        zip: [''],
        addressTypeId: ['']
      }),

      groups: ['']
    });

  }
  get phones() {
    return this.userInfoGroup.get('phones') as FormArray;
  }
  get emails() {
    return this.userInfoGroup.get('emails') as FormArray;
  }
  get address() {
    return this.userInfoGroup.get('address') as FormGroup;
  }
  get city() {
    return this.userInfoGroup.get('addresses.cityName');
  }
  get street() {
    return this.userInfoGroup.get('addresses.street');
  }
  get customerMainInfo() {
    return this.userInfoGroup.get('customerMainInfo') as FormGroup;
  }
  get firstName() {
    return this.userInfoGroup.controls.customerMainInfo.get('fname');
  }
  get lastName() {
    return this.userInfoGroup.controls.customerMainInfo.get('lname');
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
    return this.userInfoGroup.controls.customerMainInfo.get('customerCode');
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
    return this.userInfoGroup.controls.customerMainInfo.get('afterSunset1');
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
  ngOnChanges() {
    // if (this.customerInfo !== undefined) {
    //   // if (this.customerInfo['CustomerEmails'].length !== 0) {
    //   this.customerEmails = this.customerInfo['CustomerEmails'];
    //   // }
    //   // if (this.customerInfo['CustomerMobilePhones'].length !== 0) {
    //   this.customerPhones = this.customerInfo['CustomerMobilePhones'];
    //   // }
    //   // if (this.customerInfo['CustomerInfoForReceiept'].length !== 0) {
    //   this.customerDetails = this.customerInfo['CustomerInfoForReceiept'];
    //   // }
    //   // if (this.customerInfo['CustomerAddresses'].length !== 0) {
    //   this.customerAddresses = this.customerInfo['CustomerAddresses'];
    //   // }
    // }

    // this.changeCustomerInfoIfCustomerIsFound(this.customerInfo);

    // console.log('CUSTOMER INFO GOT', this.customerInfo);
    // console.log(this.foundCustomerEmails, this.foundCustomerPhones);

    // this.creditCardService.currentlyCreditCardVerified.subscribe((isVerified: boolean) => {
    //   this.isVerified = isVerified;
    //   console.log('this.isVerified', this.isVerified);
    //   this.disabledNextStep();
    // });
  }




  getCustomerTypes(data) {
    this.customerTypes = data['GetCustomerTypes'];
  }
  getGlobalData() {
    this.subscriptions.add(this.generalService.getGlobalData$().subscribe(data => {
      if (data) {
        this.getCustomerTypes(data)
        this.setCustomerTitleAutoComplete(data.CustomerTitle, this.title, 'TitleHeb')
      }
      console.log(this.customerTypes);
    }));
  }
  ngOnInit() {
    this.getCurrentLanguage();
    // console.log('this.payMath', this.payMath)

    this.getGlobalData();
    this.subscriptions.add(this.receiptService.currentStep$.subscribe(step => this.step = step));

    this.getPaymentTypes();
    this.getPayMethFromLocalStorage();

    this.disabledNextStep();
    this.getCustomerInfoById();

    this.getCities();
    this.subscriptions.add(this.userInfoGroup.valueChanges.pipe(debounceTime(1000))
      .subscribe(data => {
        this.setItemToSessionStorage('fname', data.customerMainInfo.fname);
        this.setItemToSessionStorage('lname', data.customerMainInfo.lname);
        this.setItemToSessionStorage('company', data.customerMainInfo.company);
        this.setItemToSessionStorage('customerType', data.customerMainInfo.customerType);
        this.setItemToSessionStorage('title', data.customerMainInfo.title);
        this.setItemToSessionStorage('gender', data.customerMainInfo.gender);
        this.setItemToSessionStorage('customerCode', data.customerMainInfo.customerCode);
        this.setItemToSessionStorage('spouseName', data.customerMainInfo.spouseName);
        this.setItemToSessionStorage('fileAs', data.customerMainInfo.fileAs);
        this.setItemToSessionStorage('afterSunset1', data.customerMainInfo.afterSunset);
      }));
    // this.receiptService.blockPayMethod.subscribe((data: boolean) => {
    //   this.disabledPayMethod = data;
    //   console.log(this.disabledPayMethod)
    // });
    this.getCreateNewEvent();
    console.log(this.userInfoGroup.value)
    // this.filterOptionForCustomerSearch();
    this.cityAutocomplete(this.cities, this.address.controls.cityName, 'CityName');
    this.getCurrentRoute()
  }
  getCurrentRoute() {
    console.log('Route', this.activatedRoute.url)
    this.currentRoute = this.activatedRoute.url;
    this.generalService.partOfApplication.next(this.currentRoute);
  }
  getCurrentLanguage() {
    this.subscriptions.add(this.generalService.currentLang$.subscribe((lang: string) => {
      this.currentLang = lang;
    }));
  }

  // updateCustomerInfo() {
  //   if (typeof (this.customerInfo) != 'undefined' && this.customerInfo) {
  //     this.changeCustomerInfoIfCustomerIsFound(this.customerInfo);

  //     this.showMoreInfo = false;
  //   }
  // }
  disabledNextStep() {
    this.checkRequiredNameFields();
    this.subscriptions.add(this.userInfoGroup.controls.customerMainInfo.valueChanges
      .pipe(takeUntil(this.subscription$))
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

  changeCustomerInfoIfCustomerIsFound(customer: CustomerInfoByIdForCustomerInfoComponent) {
    if (customer) {
      this.refreshCustomerForm();

      const custInfo = customer.customerMainInfo[0];
      this.receiptService.setIsNewCustomer(false);
      // this.receiptService.setStep(1);
      this.customerInfoTitle = `${custInfo['FileAs']} ${custInfo['CustomerId']}`;
      console.log(this.customerInfoTitle);
      this.setCustomerAddressFormControls();
      this.setCustomerEmailFormControls();
      this.setCustomerPhoneFormControls();
      this.setCustomerMainInfo();

      // this.updateCustomerMainInfo(custInfo);

      // this.updateCustomerAddress(customer);
      // this.updateCustomerPhones();

      // this.updateCustomerEmails(custInfo);
    }
    // this.disabledNextStep();
    //   console.log('work');
    // console.log('GROUPS', this.customerInfo.QuickGeneralGroupList);
  }

  // updateCustomerMainInfo(custInfo) {
  //   this.userInfoGroup.controls.customerMainInfo.patchValue({
  //     customerId: custInfo.CustomerId,
  //     firstName: custInfo.fname,
  //     lastName: custInfo.lname,
  //     company: custInfo.Company,
  //     customerType: custInfo.CustomerType,
  //     title: custInfo.Title,
  //     gender: custInfo.Gender,
  //     tZ: custInfo.CustomerCode,
  //     spouseName: custInfo.SpouseName,
  //     fileAs: custInfo.FileAs,
  //     birthday: moment(custInfo.BirthDate).format('DD/MM/YYYY'),
  //     afterSunset: custInfo.AfterSunset1,
  //   });
  // }
  // updateCustomerAddress(customer) {
  //   if (customer.CustomerAddresses.length > 0) {
  //     this.userInfoGroup.controls.addresses.patchValue({
  //       city: customer.CustomerAddresses[0].CityName,
  //       street: customer.CustomerAddresses[0].Street,
  //       zip: customer.CustomerAddresses[0].Zip,
  //       addresstypeid: customer.CustomerAddresses[0].AddressTypeId

  //     });
  //   } else {
  //     this.userInfoGroup.controls.addresses.patchValue({
  //       city: '',
  //       street: '',
  //       zip: '',
  //       addresstypeid: ''
  //     });
  //   }
  // }
  // updateCustomerPhones() {
  //   if (this.foundCustomerPhones.length > 0) {
  //     this.phones.controls[0].patchValue({
  //       PhoneTypeId: this.foundCustomerPhones[0]['PhoneTypeId'],
  //       phone: this.foundCustomerPhones[0]['PhoneNumber'],
  //     });
  //     this.foundCustomerPhones = [];
  //   } else {
  //     this.phones.controls[0].patchValue({
  //       PhoneTypeId: 2,
  //       phone: ''
  //     });
  //   }
  // }
  // updateCustomerEmails(custInfo) {
  //   if (this.foundCustomerEmails.length > 0) {
  //     let i = 0;
  //     for (const email of this.foundCustomerEmails) {
  //       this.emails.controls[i].patchValue({
  //         emailname: email['EmailName'],
  //         email: email['Email'],
  //       });
  //       if (this.foundCustomerEmails.length > i + 1) {
  //         this.addEmail();
  //         i++;
  //       } else {
  //         break;
  //       }
  //     }
  //     this.foundCustomerEmails = [];
  //   } else {
  //     this.emails.controls[0].patchValue({
  //       emailname: custInfo.fname,
  //       email: ''
  //     });
  //   }
  // }
  getCreateNewEvent() {
    this.subscriptions.add(this.receiptService.createNewEvent.subscribe(() => {
      this.refreshCustomerForm();
    }));
  }
  refreshCustomerForm() {
    this.customerInfoTitle = '';
    this.userInfoGroup.reset();
    sessionStorage.clear();
    this.showMoreInfo = false;
    this.resetEmails();
    this.resetPhones();
    this.resetGroup();
    // this.resetAddresses();
    this.refreshRequiredFormFields();
    this.disabledNextStep();

  }
  refreshRequiredFormFields() {
    this.userInfoGroup.patchValue({
      customerId: null,
      fname: '',
      lname: '',
      company: ''
    });
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
  // deleteAddress(i) {
  //   if (i === 0) {
  //     return;
  //   } else {
  //     this.address.removeAt(i);
  //   }
  // }
  changeBirthdayFormat(birthDay: AbstractControl) {
    let birthday = moment(birthDay.value).format('DD/MM/YYYY');
    if (birthday === 'Invalid date') {
      birthday = '';
    }
    return birthday;
  }

  addCUstomerInfoToReceipt() {



    // tslint:disable-next-line: max-line-length

    this.sendNewCustomerToNewReceipt();



    this.receiptService.setFullName(`${this.firstName.value} ${this.lastName.value}`);
    // this.receiptService.setCustomerMainfInfoToReceipt(this.userInfoGroup.get('customerMainInfo').value);
    // this.receiptService.newReceipt.customerInfo.customermaininfo.birthday = birthday;
    // this.receiptService.setPhonesToReceipt(this.deleteEmptyPhone(this.phones));
    // this.receiptService.setEmailsToReceipt(this.deleteEmptyEmail(this.emails));
    // // this.receiptService.setAdressesToReceipt(this.deleteEmptyAddress(this.addresses));
    // this.receiptService.customerEmails.next(this.deleteEmptyEmail(this.emails));
    // this.receiptService.addGroupsToReceipt(this.addGroups());
    // this.addCurrentAddress(this.address);
    this.setCustomerCreditCardList();
    // this.receiptService.newReceipt.customerInfo.groups = this.userInfoGroup.get('groups').value;


    // const customermaininfo = this.userInfoGroup.get('customerMainInfo').value;
    // this.receiptService.customerMainInfoForCustomerInfo(customermaininfo)
    // const paymentMethodId = this.payMath;
    // this.receiptService.paymentMethod.next(paymentMethodId.value);
    // localStorage.setItem('paymenthMethod', paymentMethodId.value);
    console.log('form.value', this.userInfoGroup.value);
    console.log('this.receiptService.newReceipt', this.receiptService.newReceipt);
  }
  addCurrentAddress(currentAddress: FormGroup) {
    this.customerInfoService.addCurrentAddress(currentAddress)
  }
  submit() {
    const birthday = this.changeBirthdayFormat(this.birthday);
    this.setItemToSessionStorage('birthday', birthday);

    if (this.firstName.value === null) {
      this.firstName.patchValue('');
    }
    if (this.lastName.value === null) {
      this.lastName.patchValue('');
    }

    this.setNewCustomer(this.customerMainInfo.value, this.phones.value, this.emails.value, this.address.value, this.getPickedGroups());
    switch (this.currentRoute) {
      case '/home/newreceipt':
        this.addCUstomerInfoToReceipt()
        this.receiptService.setStep(3);
        break
      case '/home/payments-grid/customer-search':
        this.goToNewPaymentPage();
        this.receiptService.createNewClicked();
        break
      case '/home/new-customer':
        this.saveNewCustomer(this.getNewCustomer());
        setTimeout(() => this.goToNewCustomerDetails(3076), 2000);
        console.log('New Customer');
        break
    }
    // const birthday = this.changeBirthdayFormat(this.birthday);
    // this.setItemToSessionStorage('birthday', birthday);
    // this.setNewCustomer(this.customerMainInfo.value, this.phones.value, this.emails.value, this.address.value, this.getPickedGroups());
  }
  openShop() {
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
  setItemToSessionStorage(key: string, value: string) {
    if (value === '' || value === null) {
      value = '';
      sessionStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
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
    this.subscriptions.add(this.receiptService.getGlobalReceiptData$().subscribe(data => {
      this.paymentMethods = data['PaymentTypes'];
    }));
  }

  deleteEmptyPhone(phones: FormArray) {
    return this.customerInfoService.deleteEmptyFormField(phones, 'phoneNumber');
  }
  deleteEmptyEmail(emails: FormArray) {
    return this.customerInfoService.deleteEmptyFormField(emails, 'email');
  }
  deleteEmptyAddress(addresses: FormArray) {
    return this.customerInfoService.deleteEmptyFormField(addresses, 'cityName');
  }

  resetPhones() {
    this.customerInfoService.resetFormArray(this.phones)
    // for (let i = this.phones.value.length; i > 0; i--) {
    //   this.deletePhone(i);
    // }
  }
  resetEmails() {
    this.customerInfoService.resetFormArray(this.emails)
    // for (let i = this.emails.value.length; i > 0; i--) {
    //   this.deleteEmail(i);
    // }
  }
  // resetAddresses() {
  //   this.customerInfoService.resetFormArray(this.addresses)
  //   // for (let i = this.addresses.value.length; i > 0; i--) {
  //   //   this.deleteAddress(i);
  //   // }
  // }
  getEventsFromChildComponent($event: { action: string, index: number }) {
    switch ($event.action) {
      case 'toShop': this.openShop();
        break
      case 'toNextStep': this.submit();
        break
      case 'addEmail': this.addEmail();
        break
      case 'addPhone': this.addPhone();
        break
      case 'deleteEmail': this.deleteEmail($event.index);
        break
      case 'deletePhone': this.deletePhone($event.index);
        break
    }
  }
  resetGroup() {
    this.group.patchValue('');
  }

  pickCustomerTypeId(typeId: number) {
    for (const customerType of this.customerTypes) {
      if (customerType['TypeId'] === typeId) {
        this.customerType.patchValue(customerType['TypeId']);
      }
    }
  }
  getPickedGroups() {
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

  goToNewPaymentPage() {
    this.toNewPayment.emit();
  }
  goToNewCustomerDetails(id: number) {
    this.toNewCustomerDetails.emit(id);
  }
  saveNewCustomer(newCustomer) {
    console.log(newCustomer);
  }
  setCustomerCreditCardList() {
    if (this.customerInfoById !== null) {
      this.paymentsService.setListCustomerCreditCard(this.customerInfoById.customerCreditCardTokens);
    }
  }
  addPhone() {
    this.generalService.addPhoneInput(this.phones, this.fb);
  }
  addEmail() {
    this.generalService.addEmailInput(this.emails, this.fb);
  }
  // addAddress() {
  //   this.generalService.addAddressInput(this.addresses, this.fb);
  // }
  setCustomerPhoneFormControls() {
    this.customerInfoService.patchInputValue(this.phones, this.customerPhones, this.generalService.getAddPhoneFunction(), this.fb);
  }
  setCustomerAddressFormControls() {
    this.customerInfoService.patchInputValue(this.address, this.customerAddress)
  }
  setCustomerEmailFormControls() {
    this.customerInfoService.patchInputValue(this.emails, this.customerEmails, this.generalService.getAddEmailFunction(), this.fb)
  }
  setCustomerMainInfo() {
    this.customerInfoService.patchInputValue(this.customerMainInfo, this.customerDetails)
  }
  setCustomerTitleAutoComplete(filteredSubject: CustomerTitle[], formControl: AbstractControl, filterKey: string) {
    this.filterCustTitle$ = this.generalService.formControlAutoComplete(filteredSubject, formControl, filterKey);
  }
  cityAutocomplete(filteredSubject: CustomerTitle[], formControl: AbstractControl, filterKey: string) {
    this.filteredCity$ = this.generalService.formControlAutoComplete(filteredSubject, formControl, filterKey);
  }
  getCustomerInfoById() {
    this.customerInfoService.getCustomerInfoById$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(customerInfo => {
        this.customerInfoById = customerInfo;
        console.log('CUSTOMER INFO GOT', customerInfo);
        if (customerInfo) {
          // if (this.customerInfo['CustomerEmails'].length !== 0) {
          this.customerEmails = customerInfo['customerEmails'];
          // }
          // if (this.customerInfo['CustomerMobilePhones'].length !== 0) {
          this.customerPhones = customerInfo['customerPhones'];
          // }
          // if (this.customerInfo['CustomerInfoForReceiept'].length !== 0) {
          this.customerDetails = customerInfo['customerMainInfo'];
          // }
          // if (this.customerInfo['CustomerAddresses'].length !== 0) {
          this.customerAddress = customerInfo['customerAddress'].filter(address => customerInfo['customerAddress'].indexOf(address) === 0);
          // }
          this.customerGroupList = customerInfo.customerGroupList;
        }

        this.changeCustomerInfoIfCustomerIsFound(customerInfo);
      })
  }
  getCities() {
    this.customerInfoService.getCities().pipe(
      takeUntil(this.subscription$)).subscribe(cities => this.cities = cities);
  }
  setNewCustomer(customermaininfo: Customermaininfo, phones: Phones[], emails: Emails[], addresses: Addresses, groups: Group[]
  ) {
    this.customerInfoService.setNewCustomer(customermaininfo, phones, emails, addresses, groups)
  }
  getNewCustomer() {
    return this.customerInfoService.getNewCustomer()
  }
  sendNewCustomerToNewReceipt() {
    // debugger
    this.receiptService.setNewReceiptCustomerInfo(this.getNewCustomer());
  }
  ngOnDestroy() {
    this.customerInfoService.clearCustomerById();
    this.subscriptions.unsubscribe();
    this.subscription$.next();
    this.subscription$.complete();
    console.log('CUSTOMER INFO DESTROED');
  }
}