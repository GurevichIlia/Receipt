import { CustomerGroupsGeneralSet } from './../../models/customer-info-by-ID.model';
import { CustomerGroupsService } from './../../core/services/customer-groups.service';
import { GlobalStateService } from './../../shared/global-state-store/global-state.service';
import { CustomerGroupsComponent } from './../../shared/modals/customer-groups/customer-groups.component';
import { Customerinfo } from './../../models/customerInfo.model';
import { CustomerInfoViewComponent } from './customer-info-view/customer-info-view.component';
import { SuggestExistingCustomerComponent } from './../../shared/modals/suggest-existing-customer/suggest-existing-customer.component';

import { Component, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit, AfterContentInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';

import { Observable, Subscription, Subject, of, EMPTY, } from 'rxjs';
import { debounceTime, takeUntil, filter, switchMap, } from 'rxjs/operators';

import { ReceiptsService } from '../services/receipts.service';
import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { PaymentsService } from './../../grid/payments.service';

import * as moment from 'moment';

import { CustomerType } from 'src/app/models/customerType.model';
import { GetCustomerReceipts } from 'src/app/models/customer-info-by-ID.model';
import { CustomerInfoService, CustomerInfoByIdForCustomerInfoComponent, NewCustomerInfo } from './customer-info.service';
import { CustomerTitle } from 'src/app/models/globalData.model';
import { ReceiptGLobalData } from 'src/app/models/receiptGlobalData.model';
import { Phones } from 'src/app/models/phones.model';
import { Emails } from 'src/app/models/emails.model';
import { Addresses } from 'src/app/models/addresses.model';
import { CustomerGroupById } from 'src/app/models/customerGroupById.model';
import { MatDialog } from '@angular/material';
import { CustomerMainInfo } from 'src/app/models/customermaininfo.model';
import { GeneralGroups } from 'src/app/models/generalGroups.model';

export interface Group {
  GroupId: number;
};
@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  cities$: Observable<any[]>;
  customerTitle: CustomerTitle[];;
  customerTypes: CustomerType[];
  @Output() toNewPayment = new EventEmitter();
  @Output() onSave = new EventEmitter<NewCustomerInfo>();
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


  selectedGroups: CustomerGroupsGeneralSet[] = [];
  currentRoute: string;
  private subscriptions: Subscription = new Subscription();
  paymentsListData: GetCustomerReceipts;

  globalReceiptData: ReceiptGLobalData;

  customerPhones: Phones[];
  customerEmails: Emails[];
  customerAddress: Addresses[];
  customerDetails: CustomerMainInfo[];



  customer: {
    customermaininfo: CustomerMainInfo;
    phones: Phones[];
    emails: Emails[];
    addresses: Addresses;
    groups: Group[];

  }
  selectedGroups$: Observable<number[]>
  subscription$ = new Subject();
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private fb: FormBuilder,
    private route: Router,
    private paymentsService: PaymentsService,
    private customerInfoService: CustomerInfoService,
    private matDialog: MatDialog,
    private customerGroupsService: CustomerGroupsService
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
        gender: [0],
        customerCode: [this.getItemsFromSessionStorage('tZ')],
        spouseName: [this.getItemsFromSessionStorage('spouseName')],
        fileAs: [this.getItemsFromSessionStorage('fileAs')],
        birthday: [''],
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
      addresses: this.fb.array([
        this.fb.group({
          cityName: [''],
          street: [''],
          street2: [''],
          zip: [''],
          addressTypeId: [''],
          mainAddress: [''],


        }),
      ]),
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
    return this.userInfoGroup.get('addresses') as FormArray;
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





  getCustomerTypes(data) {
    this.customerTypes = data['GetCustomerTypes'];
  }
  getGlobalData() {
    this.subscriptions.add(this.generalService.getGlobalData$()
      .pipe(
        debounceTime(1),
        takeUntil(this.subscription$)).subscribe(data => {
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
    this.receiptService.currentStep$
      .pipe(
        takeUntil(this.subscription$)).subscribe(step => this.step = step);

    this.getPaymentTypes();
    this.getPayMethFromLocalStorage();

    this.disabledNextStep();
    this.getCurrentCustomerInfoByIdForCustomerInfoComponent();
    // this.suggestUseExistingCustomerDetails();
    this.getCities();

    this.getCreateNewEvent();
    // setTimeout(() => this.suggestUseExistingCustomerDetails(), 1000);
    // this.userInfoGroup.valueChanges.pipe(debounceTime(1000))
    //   .subscribe(data => {
    //     this.setItemToSessionStorage('fname', data.customerMainInfo.fname);
    //     this.setItemToSessionStorage('lname', data.customerMainInfo.lname);
    //     this.setItemToSessionStorage('company', data.customerMainInfo.company);
    //     this.setItemToSessionStorage('customerType', data.customerMainInfo.customerType);
    //     this.setItemToSessionStorage('title', data.customerMainInfo.title);
    //     this.setItemToSessionStorage('gender', data.customerMainInfo.gender);
    //     this.setItemToSessionStorage('customerCode', data.customerMainInfo.customerCode);
    //     this.setItemToSessionStorage('spouseName', data.customerMainInfo.spouseName);
    //     this.setItemToSessionStorage('fileAs', data.customerMainInfo.fileAs);
    //     this.setItemToSessionStorage('afterSunset1', data.customerMainInfo.afterSunset);
    //   });
    // this.receiptService.blockPayMethod.subscribe((data: boolean) => {
    //   this.disabledPayMethod = data;
    //   console.log(this.disabledPayMethod)
    // });
    console.log(this.userInfoGroup.value)
    // this.filterOptionForCustomerSearch();

    this.group.valueChanges.subscribe(value => {
      console.log(value);
    })

    this.getCurrentRoute();
    this.customerInfoService.getEventCUstomerIsFoundById$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(() => {
        this.changeCustomerInfoIfCustomerIsFound(this.customerInfoById);
        console.log('EVENT CUSTOMER FOUND');
      });
  }

  ngAfterViewInit(): void {
    // this.suggestUseExistingCustomerDetails();
  }

  ngAfterContentInit() {
    // this.suggestUseExistingCustomerDetails();

  }
  getCurrentRoute() {
    console.log('Route', this.route);
    this.currentRoute = this.route.url;
    this.generalService.partOfApplication.next(this.currentRoute);
  }
  getCurrentLanguage() {
    this.subscriptions.add(this.generalService.currentLang$
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((lang: string) => {
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
      .pipe(
        debounceTime(1),
        takeUntil(this.subscription$))
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
      console.log(this.customerInfoTitle);
      this.customerInfoService.updateValueInAddressInputsArray(this.address, customer.customerAddress);
      // this.setCustomerAddressFormControls(this.address, customer.customerAddress, this.generalService.getAddAddressFunction(), this.fb);
      this.customerInfoService.updateValueInEmailInputsArray(this.emails, customer.customerEmails)
      // this.setCustomerEmailFormControls(this.emails, customer.customerEmails, this.generalService.getAddEmailFunction(), this.fb);
      this.customerInfoService.updateValueInPhoneInputsArray(this.phones, customer.customerPhones)
      // this.setCustomerPhoneFormControls(this.phones, customer.customerPhones, this.generalService.getAddPhoneFunction(), this.fb);

      if (customer.pickedGroups) {
        customer.pickedGroups.map(group => this.customerGroupsService.markGroupAsSelected(group.CustomerGeneralGroupId));
        this.customerGroupsService.updateCustomerGroups();
        
      } 
      this.setCustomerMainInfo(this.customerMainInfo, [customer.customerMainInfo[0]]);

      if (custInfo.customerId) {
        this.disableFormGroup(this.userInfoGroup);
        this.customerInfoTitle = `${custInfo.fileAs} ${custInfo.customerId}`
      } else {
        this.customerInfoTitle = 'New customer'
      }

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
    this.subscriptions.add(this.customerInfoService.createNewEvent$.subscribe(() => {
      this.refreshCustomerForm();
      this.enableFormGroup(this.userInfoGroup)
      // this.customerInfoService.clearCurrentCustomerInfoByIdForCustomerInfoComponent();
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
    this.resetAddresses();
    this.refreshRequiredFormFields();
    this.disabledNextStep();
    this.customerGroupsService.clearSelectedGroups();

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

  deleteAddress(i) {
    if (i === 0) {
      return;
    } else {
      this.address.removeAt(i);
    }
  }


  changeBirthdayFormat(birthDay: AbstractControl) {
    let birthday = moment(birthDay.value).format('DD/MM/YYYY');
    if (birthday === 'Invalid date') {
      birthday = '';
    }
    return birthday;
  }









  addCurrentAddress(currentAddress: Addresses[]) {
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
    this.setCurrentCustomerInfoByIdState(this.emails.value, this.phones.value, this.address.value, [this.customerMainInfo.value], this.customerGroupsService.getTransformedSelectedGroups());
    // this.customerInfoService.setCustomerInfoById(this.emails.value, this.phones.value, this.address.value, this.customerMainInfo.value, null, this.getPickedGroups());
    switch (this.currentRoute) {
      case '/home/newreceipt':
        this.setCustomerInfoToNewReceipt();
        this.receiptService.setStep(3);
        break
      case '/home/payments-grid/customer-search':
        this.goToNewPaymentPage();
        // this.receiptService.createNewClicked();
        break
      case '/home/new-customer':


        this.saveNewCustomer(this.userInfoGroup.value);

        break
    }

  }
  openShop() {
    this.setCustomerInfoToNewReceipt();
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
  resetAddresses() {
    this.customerInfoService.resetFormArray(this.address)
    //   // for (let i = this.addresses.value.length; i > 0; i--) {
    //   //   this.deleteAddress(i);
    //   // }
  }
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
      case 'addAddress': this.addAddress();
        break
      case 'deleteEmail': this.deleteEmail($event.index);
        break
      case 'deletePhone': this.deletePhone($event.index);
        break
      case 'deleteAddress': this.deleteAddress($event.index);
        break
      // case 'showGroups': this.openCustomerGroupsModal();
      //   break
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


  goToNewPaymentPage() {
    this.toNewPayment.emit();
  }

  // goToNewCustomerDetails(id: number) {
  //   this.toNewCustomerDetails.emit(id);
  // }

  saveNewCustomer(newCustomer: NewCustomerInfo) {
    this.deleteEmptyEmail(this.emails);
    this.deleteEmptyAddress(this.address);
    this.deleteEmptyPhone(this.phones);
    newCustomer.customerMainInfo.fileAs = this.customerInfoService.createFileAs(newCustomer.customerMainInfo);
    this.onSave.emit(newCustomer);
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

  addAddress() {
    this.generalService.addAddressInput(this.address, this.fb);
  }

  // setCustomerPhoneFormControls(
  //   inputsArray: FormArray | FormGroup,
  //   valueArray: Phones[] | Emails[] | Addresses[] | CustomerMainInfo[],
  //   addNewInputFunction?: Function,
  //   formBuilder?: FormBuilder) {
  //   this.customerInfoService.patchInputValue(inputsArray, valueArray, addNewInputFunction, formBuilder);
  // }

  // setCustomerAddressFormControls(
  //   inputsArray: FormArray | FormGroup,
  //   valueArray: Phones[] | Emails[] | Addresses[] | CustomerMainInfo[],
  //   addNewInputFunction?: Function,
  //   formBuilder?: FormBuilder
  // ) {
  //   this.customerInfoService.patchInputValue(inputsArray, valueArray, addNewInputFunction, formBuilder)
  // }

  // setCustomerEmailFormControls(
  //   inputsArray: FormArray | FormGroup,
  //   valueArray: Phones[] | Emails[] | Addresses[] | CustomerMainInfo[],
  //   addNewInputFunction?: Function,
  //   formBuilder?: FormBuilder
  // ) {
  //   this.customerInfoService.patchInputValue(inputsArray, valueArray, addNewInputFunction, formBuilder)
  // }

  setCustomerMainInfo(
    inputsArray: FormArray | FormGroup,
    valueArray: Phones[] | Emails[] | Addresses[] | CustomerMainInfo[]
  ) {
    this.customerInfoService.patchInputValue(inputsArray, valueArray)
  }

  setCustomerTitleAutoComplete(filteredSubject: CustomerTitle[], formControl: AbstractControl, filterKey: string) {
    this.filterCustTitle$ = this.generalService.formControlAutoComplete(filteredSubject, formControl, filterKey);
  }

  cityAutocomplete(filteredSubject: CustomerTitle[], formControl: AbstractControl, filterKey: string) {
    this.filteredCity$ = this.generalService.formControlAutoComplete(filteredSubject, formControl, filterKey);
    return this.filteredCity$;
  }

  getCurrentCustomerInfoByIdForCustomerInfoComponent() {
    this.customerInfoService.getCurrentCustomerInfoByIdForCustomerInfoComponent$()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((customerInfo: CustomerInfoByIdForCustomerInfoComponent) => {
        console.log('CUSTOMER INFO GOT IN CUSTOMER INFO COMPONENT', customerInfo);
        if (customerInfo) {
          this.customerInfoById = customerInfo;

          this.changeCustomerInfoIfCustomerIsFound(customerInfo);

        } else {
          setTimeout(() => this.suggestUseExistingCustomerDetails(), 1000);

        }
      })
  }

  getCities() {
    this.customerInfoService.getCities$()
      .pipe(
        filter(cities => cities !== null),
        debounceTime(1),
        takeUntil(this.subscription$))
      .subscribe(cities => {
        this.cities$ = of([...cities])
      });



  }

  setCurrentCustomerInfoByIdState(customerEmails: Emails[],
    customerPhones: Phones[],
    customerAddress: Addresses[],
    customerMainInfo: CustomerMainInfo[],
    pickedGroups?: CustomerGroupsGeneralSet[],
    customerCreditCardTokens?: any[],

  ) {
    debugger
    this.customerInfoService.setCurrentCustomerInfoByIdState({ customerEmails, customerPhones, customerAddress, customerMainInfo, pickedGroups })
  }

  // getNewCustomer() {
  //   return this.customerInfoService.getNewCustomer();
  // }

  setCustomerInfoToNewReceipt() {
    const customerInfo: Customerinfo = Object.assign({}, this.userInfoGroup.value);

    // customerInfo.addresses = customerInfo.addresses;
    customerInfo.groups = this.customerGroupsService.getTransformedSelectedGroups()

    this.receiptService.setFullName(`${this.firstName.value} ${this.lastName.value}`);

    this.receiptService.customerEmails.next(this.deleteEmptyEmail(this.emails));
    // this.receiptService.addGroupsToReceipt(this.addGroups());
    this.addCurrentAddress(this.deleteEmptyAddress(this.address));
    this.setCustomerCreditCardList();


    this.receiptService.setCustomerInfoToNewReceipt(customerInfo);

    console.log('form.value', this.userInfoGroup.value);
    console.log('this.receiptService.newReceipt', this.receiptService.newReceipt);
  }

  getGlobalCustomerDetailsState() {
    return this.customerInfoService.getGlobalCustomerDetailsState()
  }

  suggestUseExistingCustomerDetails() {
    if (this.getGlobalCustomerDetailsState() && this.generalService.getCurrentRoute() !== '/home/new-customer') {
      const matDialog = this.matDialog.open(SuggestExistingCustomerComponent, { width: '450px', height: '200px', position: { top: 'top' }, disableClose: true, data: { customer: this.getGlobalCustomerDetailsState().CustomerCard_MainDetails } })
      matDialog.afterClosed()
        .pipe(
          takeUntil(this.subscription$))
        .subscribe((response: boolean) => {
          if (response === true) {
            // this.customerInfoService.setCustomerInfoById(customerInfo.CustomerEmails, customerInfo.GetCustomerPhones, customerInfo.CustomerAddresses, customerInfo.CustomerCard_MainDetails, null, customerInfo.CustomerGroupsGeneralSet)
            this.customerInfoService.setCurrentCustomerInfoByIdState(this.customerInfoService.getCustomerDetailsByIdTranformedForCUstomerInfoComponent());
          } else if (response === false) {
            this.customerInfoService.createNewClicked();
            // this.customerInfoService.clearCustomerById();
          }
        }
        );
    } else if (this.generalService.getCurrentRoute() === '/home/new-customer') {
      // this.customerInfoService.createNewClicked()
      console.log('No One CUSTOMER')
    } else {
      console.log('No One CUSTOMER')

    }
  }

  disableFormGroup(formGroup: FormGroup) {
    formGroup.disable();
  }

  enableFormGroup(formGroup: FormGroup) {
    formGroup.enable();
  }

  // openCustomerGroupsModal() {
  //   const groupsModal$ = this.matDialog.open(CustomerGroupsComponent, { width: '500px', height: '600px', disableClose: true });

  //   groupsModal$.afterClosed().pipe(switchMap((modalResult: boolean) => {
  //     if (modalResult) {
  //       return this.customerGroupsSevice.getSelectedGroups$();
  //     } else if (!modalResult) {
  //       // this.customerGroupsSevice.clearSelectedGroups();
  //       return EMPTY
  //     }
  //   }))
  //     .pipe(
  //       takeUntil(this.subscription$))
  //     .subscribe(selectedGroups => {
  //       debugger
  //       this.selectedGroups = selectedGroups.map(group => group.GroupId);
  //       console.log('SELECTED GROUPS AFTER CONFIRM', this.selectedGroups);
  //     })



  // }


  // addGroupsIsClicked() {
  //   this.customerGroupsSevice.addGroupsIsClicked$
  //     .pipe(
  //       takeUntil(this.subscription$)
  //     ).subscribe(() => this.openCustomerGroupsModal());
  // }

  // getSelectedGroups() {
  //   this.customerGroupsService.getSelectedGroups$()
  //     .pipe(
  //       takeUntil(this.subscription$))
  //     .subscribe((selectedGroups: GeneralGroups[]) => {
  //       if (selectedGroups)
  //         this.selectedGroups = selectedGroups;
  //     })

  // }

  ngOnDestroy() {
    // this.customerInfoService.clearCustomerById();
    this.subscriptions.unsubscribe();
    this.subscription$.next();
    this.subscription$.complete();
    console.log('CUSTOMER INFO DESTROED');
  }
}