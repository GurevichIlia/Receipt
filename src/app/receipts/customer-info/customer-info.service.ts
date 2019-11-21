import { GlobalStateService } from './../../shared/global-state-store/global-state.service';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Subject, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { ReceiptsService } from '../services/receipts.service';
import { GeneralSrv } from '../services/GeneralSrv.service';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Phones } from 'src/app/models/phones.model';
import { Emails } from 'src/app/models/emails.model';
import { Addresses } from 'src/app/models/addresses.model';
import { Group } from './customer-info.component';
import { CustomerGroupById } from 'src/app/models/customerGroupById.model';
import { CustomerMainInfo } from 'src/app/models/customermaininfo.model';
import { Customerinfo } from 'src/app/models/customerInfo.model';

export interface CustomerInfoByIdForCustomerInfoComponent {
  customerEmails: Emails[],
  customerPhones: Phones[],
  customerAddress: Addresses[],
  customerMainInfo: CustomerMainInfo[]
  customerCreditCardTokens?: any[],
  pickedGroups?: Group[]
}

@Injectable({
  providedIn: 'root'
})
export class CustomerInfoService {
  customerInfoByIdForCustomerInfoComponent = new BehaviorSubject<CustomerInfoByIdForCustomerInfoComponent>(null);
  customerInfoByIdForCustomerInfoComponent$ = this.customerInfoByIdForCustomerInfoComponent.asObservable();

  customerGroupList = new BehaviorSubject<CustomerGroupById[]>(null);
  customerGroupList$ = this.customerGroupList.asObservable();
  // currentCustomerDetailsForCustomerInfoComponent = new BehaviorSubject<CustomerInfoByIdForCustomerInfoComponent>(null);
  // currentCustomerDetailsForCustomerInfoComponent$ = this.currentCustomerDetailsForCustomerInfoComponent.asObservable();

  cities = <any>[];
  eventCustomerIsFoundById = new Subject<void>();
  eventCustomerIsFoundById$ = this.eventCustomerIsFoundById.asObservable();
  // customer: {
  //   customerMainInfo: Customermaininfo,
  //   customerPhones: Phones[],
  //   customerEmails: Emails[],
  //   customerAddresses: Addresses[],
  //   customerGroups: Group[]
  // }
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv,
    private router: Router,
    private globalStateService: GlobalStateService,
    private fb: FormBuilder
  ) {

  }

  patchInputValue(
    inputsArray: FormArray | FormGroup,
    valueArray: Phones[] | Emails[] | Addresses[] | CustomerMainInfo[],
    addNewInputFunction?: Function,
    formBuilder?: FormBuilder
  ) {
    this.generalService.patchInputValue(inputsArray, valueArray, addNewInputFunction, formBuilder)
  }

  addCurrentAddress(currentAddres: Addresses[]) {
    // const address = currentAddres.value
    // if (address.street === null) {
    //   address.street = '';
    // }
    // if (address.cityName === null) {
    //   address.cityName = '';
    // }
    // if (address.cityName !== '' || address.street !== '') {
    //   if (address.cityName.value !== '' && address.street !== '') {
    //     this.receiptService.fullAddress.next(`${address.cityName}, ${address.street}`);
    //   } else if (address.cityName !== '' || address.cityName !== null) {
    //     this.receiptService.fullAddress.next(`${address.cityName}`);
    //   } else if (address.street !== '' || address.street !== null) {
    //     this.receiptService.fullAddress.next(`${address.street}`);
    //   }
    // }
            this.receiptService.fullAddress.next(currentAddres);

  }
  resetFormArray(array: FormArray) {
    for (let i = array.value.length; i > 0; i--) {
      this.deleteFormControl(array, i);
    }
  }
  deleteFormControl(array: FormArray, i: number) {
    if (i === 0) {
      return;
    } else {
      array.removeAt(i);
    }
  }


  deleteEmptyFormField(array: FormArray, formField: string) {
    let checkedphones = array.value.filter(formGroup => formGroup[formField] !== '');
    checkedphones = checkedphones.filter(formGroup => formGroup[formField] !== null);
    checkedphones = checkedphones.filter(formGroup => formGroup[formField].trim() !== null);

    return checkedphones;
  }

  setCurrentCustomerInfoByIdForCustomerInfoComponent(
    customerInfoById: {
      customerEmails: Emails[], customerPhones: Phones[], customerAddress: Addresses[], customerMainInfo: CustomerMainInfo[], pickedGroups?: Group[], customerCreditCardTokens?: any[],
    }
  ) {
    this.customerInfoByIdForCustomerInfoComponent.next(customerInfoById);
    console.log('CURRENT CUSTOMER DETAILS IN SERVICE', customerInfoById);
  }

  getCurrentCustomerInfoByIdForCustomerInfoComponent$() {
    return this.customerInfoByIdForCustomerInfoComponent$;
  }

  getCurrentCustomerInfoByIdForCustomerInfoComponent() {
    return this.customerInfoByIdForCustomerInfoComponent.getValue();
  }

  clearCurrentCustomerInfoByIdForCustomerInfoComponent() {
    this.customerInfoByIdForCustomerInfoComponent.next(null);
    this.clearCustomerGroupList();
  }

  setCustomerGroupList(groupList: CustomerGroupById[]) {
    this.customerGroupList.next(groupList);
  }

  getCustomerGroupList$() {
    return this.customerGroupList$;
  }

  clearCustomerGroupList() {
    console.log('CLEAR CARD LIST');
    this.setCustomerGroupList(null);
  }



  // getCustomerInfoById() {
  //   return this.globalStateService.getCustomerDetailsByIdState();
  // }



  setCities(cities: any[]) {
    this.cities = cities;
  }

  getCities$() {
    return this.generalService.getCities$();
  }

  // setCurrentCustomerDetailsForCustomerInfoComponent(customermaininfo: Customermaininfo, phones: Phones[], emails: Emails[], addresses: Addresses[], groups: Group[]) {
  //   this.customer = null;
  //   this.customer = {
  //     emails,
  //     phones,
  //     addresses,
  //     customermaininfo,
  //     groups
  //   }
  //   // this.currentCustomerDetailsForCustomerInfoComponent.next(this.customer)
  // }

  // getNewCustomer() {
  //   return this.customer;
  // }

  setEventCUstomerIsFoundById() {
    this.eventCustomerIsFoundById.next();
  }

  getEventCUstomerIsFoundById$() {
    return this.eventCustomerIsFoundById$;
  }

  getGlobalCustomerDetailsState() {
    return this.globalStateService.getCustomerDetailsByIdGlobalState();
  }

  // getCurrentCustomerDetailsForCustomerInfoComponent$() {
  //   return this.currentCustomerDetailsForCustomerInfoComponent$
  // }

  getGlobalCustomerDetails() {
    this.globalStateService.getCustomerDetailsByIdGlobalState();
  }

  getCustomerDetailsByIdTranformedForCUstomerInfoComponent(): CustomerInfoByIdForCustomerInfoComponent {
    return this.globalStateService.getCustomerDetailsByIdTranformedForCUstomerInfoComponent();
  }

  setCustomerInfoToNewReceipt(customerInfo: Customerinfo) {
    this.receiptService.setCustomerInfoToNewReceipt(customerInfo)
  }


  updateValueInAddressInputsArray(
    inputsArray: FormArray,
    valueArray: Addresses[],
  ) {
    // inputsArray.controls = [];
    valueArray.map(address => {

      let index = valueArray.indexOf(address)
      inputsArray.controls[index].setValue({
        cityName: address.cityName,
        street: address.street,
        street2: address.street2,
        zip: address.zip,
        addressTypeId: address.addressTypeId
      })
      if (valueArray.length > inputsArray.controls.length) {
        this.addAddressInput(inputsArray, this.fb)
      }
    })
    inputsArray.controls.map(controls => {
      if (!controls.value.cityName && !controls.value.street) {
        this.deleteFormControl(inputsArray, inputsArray.controls.indexOf(controls));
      }
    })
  }

  updateValueInEmailInputsArray(
    inputsArray: FormArray,
    valueArray: Emails[],
  ) {
    // inputsArray.controls = [];
    valueArray.map(email => {
      let index = valueArray.indexOf(email)
      inputsArray.controls[index].setValue({
        emailName: email.emailName,
        email: email.email,
      })
      valueArray.length > inputsArray.controls.length ? this.addEmailInput(inputsArray, this.fb) : null;
    })
    inputsArray.controls.map(controls => {
      if (!controls.value.email && !controls.value.emailName) {
        this.deleteFormControl(inputsArray, inputsArray.controls.indexOf(controls));
      }
    })
  }

  updateValueInPhoneInputsArray(
    inputsArray: FormArray,
    valueArray: Phones[],
  ) {
    // inputsArray.controls = [];
    valueArray.map(phone => {
      let index = valueArray.indexOf(phone)
      inputsArray.controls[index].setValue({
        phoneTypeId: phone.phoneTypeId,
        phoneNumber: phone.phoneNumber
      })
      valueArray.length > inputsArray.controls.length ? this.addPhoneInput(inputsArray, this.fb) : null;
    })
    inputsArray.controls.map(controls => {
      if (!controls.value.phone && !controls.value.phoneNumber) {
        this.deleteFormControl(inputsArray, inputsArray.controls.indexOf(controls));
      }
    })
  }


  addPhoneInput(array: FormArray, fb: FormBuilder) {
    if (array.length < 10) {
      array.push(fb.group({
        phoneTypeId: [2],
        phoneNumber: ['']
      }));
    }
  }

  addEmailInput(array: FormArray, fb: FormBuilder) {
    if (array.length < 10) {
      array.push(fb.group({
        emailName: [''],
        email: ['', Validators.email],
      }));
    }
  }

  addAddressInput(array: FormArray, fb: FormBuilder) {
    if (array.length < 10) {
      array.push(fb.group({
        cityName: [''],
        street: [''],
        street2: [''],
        zip: [''],
        addressTypeId: ['']
      }))
    }
  }
}
