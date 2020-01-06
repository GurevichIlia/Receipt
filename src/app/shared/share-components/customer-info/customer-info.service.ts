import { NewPaymentService } from './../../../grid/grid-payments/new-payment/new-payment.service';
import { Injectable } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';

import { GlobalStateService } from '../../../shared/global-state-store/global-state.service';
import { ReceiptsService, Group } from '../../../shared/services/receipts.service';
import { GeneralSrv } from '../../../shared/services/GeneralSrv.service';

import { Phones } from 'src/app/models/phones.model';
import { Emails } from 'src/app/models/emails.model';
import { Addresses } from 'src/app/models/addresses.model';
import { CustomerInfoById, CustomerAddresses, CustomerInfoForReceiept, CustomerGroupsGeneralSet } from '../../../models/customer-info-by-ID.model';
import { CustomerMainInfo } from 'src/app/models/customermaininfo.model';
import { Customerinfo } from 'src/app/models/customerInfo.model';
import { CustomerEmails, CustomerPhones } from 'src/app/models/fullCustomerDetailsById.model';




export interface CustomerInfoByIdForCustomerInfoComponent {
  customerEmails: Emails[],
  customerPhones: Phones[],
  customerAddress: Addresses[],
  customerMainInfo: CustomerMainInfo[];
  customerGroups: Group[];
  customerCreditCardTokens?: any[],
}

export interface NewCustomerInfo {
  customerEmails: Emails[],
  customerPhones: Phones[],
  customerAddress: Addresses[],
  customerGroups: Group[];
  customerMainInfo: CustomerMainInfo;
  customerCreditCardTokens?: any[],
}

@Injectable({
  providedIn: 'root'
})
export class CustomerInfoService {
  customerInfoByIdForCustomerInfoComponent = new BehaviorSubject<CustomerInfoByIdForCustomerInfoComponent>(null);
  customerInfoByIdForCustomerInfoComponent$ = this.customerInfoByIdForCustomerInfoComponent.asObservable();

  customerGroupList = new BehaviorSubject<CustomerGroupsGeneralSet[]>(null);
  customerGroupList$ = this.customerGroupList.asObservable();
  // currentCustomerDetailsForCustomerInfoComponent = new BehaviorSubject<CustomerInfoByIdForCustomerInfoComponent>(null);
  // currentCustomerDetailsForCustomerInfoComponent$ = this.currentCustomerDetailsForCustomerInfoComponent.asObservable();
  createNewEvent$ = new Subject<void>();

  cities = <any>[];

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
    private globalStateService: GlobalStateService,
    private fb: FormBuilder,
  ) {

  }

  // patchInputValue(
  //   inputsArray: FormArray | FormGroup,
  //   valueArray: Phones[] | Emails[] | Addresses[] | CustomerMainInfo[],
  //   addNewInputFunction?: Function,
  //   formBuilder?: FormBuilder
  // ) {
  //   this.generalService.patchInputValue(inputsArray, valueArray, addNewInputFunction, formBuilder)
  // }

  addCurrentAddress(currentAddress: Addresses[]) {
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
    this.receiptService.fullAddress.next(currentAddress);

  }
  resetFormArray(array: FormArray) {
    for (let i = array.value.length; i > 0; i--) {
      this.deleteFormControl(array, i - 1);
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

  setCurrentCustomerInfoByIdState(

    customerInfoById: {
      customerEmails: Emails[], customerPhones: Phones[], customerAddress: Addresses[], customerMainInfo: CustomerMainInfo[], customerGroups: Group[], customerCreditCardTokens?: any[],
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
    // this.clearCustomerGroupList();
  }

  // setCustomerGroupList(groupList: CustomerGroupsGeneralSet[]) {
  //   this.customerGroupList.next(groupList);
  // }

  // getCustomerGroupList$() {
  //   return this.customerGroupList$;
  // }

  // clearCustomerGroupList() {
  //   console.log('CLEAR CARD LIST');
  //   this.setCustomerGroupList(null);
  // }



  // getCustomerInfoById() {
  //   return this.globalStateService.getCustomerDetailsByIdState();
  // }



  setCities(cities: any[]) {
    this.cities = cities;
  }

  // getCities$() {
  //   return this.generalService.getCities$();
  // }

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

 

  updateValueInMaininfo(form: FormGroup, customerMainInfo: CustomerMainInfo, ) {
    form.patchValue({
      customerId: customerMainInfo.customerId,
      fname: customerMainInfo.fname,
      lname: customerMainInfo.lname,
      company: customerMainInfo.company,
      // tslint:disable-next-line: max-line-length
      customerType: customerMainInfo.customerType,
      title: customerMainInfo.title,
      gender: customerMainInfo.gender,
      customerCode: customerMainInfo.customerCode,
      spouseName: customerMainInfo.spouseName,
      fileAs: customerMainInfo.fileAs,

      afterSunset1: customerMainInfo.afterSunset1,
    })


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
        addressTypeId: address.addressTypeId,
        mainAddress: address.mainAddress
      })
      if (valueArray.length > inputsArray.controls.length) {
        this.generalService.addAddressInput(inputsArray, this.fb)
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
      valueArray.length > inputsArray.controls.length ? this.generalService.addEmailInput(inputsArray, this.fb) : null;
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
      valueArray.length > inputsArray.controls.length ? this.generalService.addPhoneInput(inputsArray, this.fb) : null;
    })
    inputsArray.controls.map(controls => {
      if (!controls.value.phone && !controls.value.phoneNumber) {
        this.deleteFormControl(inputsArray, inputsArray.controls.indexOf(controls));
      }
    })
  }


  // addPhoneInput(array: FormArray, fb: FormBuilder) {
  //   if (array.length < 10) {
  //     array.push(fb.group({
  //       phoneTypeId: ['2'],
  //       phoneNumber: ['']
  //     }));
  //   }
  // }

  // addEmailInput(array: FormArray, fb: FormBuilder) {
  //   if (array.length < 10) {
  //     array.push(fb.group({
  //       emailName: [''],
  //       email: ['', Validators.email],
  //     }));
  //   }
  // }

  // addAddressInput(array: FormArray, fb: FormBuilder) {
  //   if (array.length < 10) {
  //     array.push(fb.group({
  //       cityName: [''],
  //       street: [''],
  //       street2: [''],
  //       zip: [''],
  //       addressTypeId: [''],
  //       mainAddress: ['']
  //     }))
  //   }
  // }
  transformCustomerDetailsForCustomerInfoComponent(customerDetails: CustomerInfoById) {
    const newObject: CustomerInfoByIdForCustomerInfoComponent = {
      customerEmails: customerDetails.CustomerEmails.map((email: CustomerEmails) => {
        const changedEmail = {
          emailName: email.EmailName,
          email: email.Email
        }
        return changedEmail;
      }),
      customerPhones: customerDetails.CustomerMobilePhones.map((phone: CustomerPhones) => {
        const changedPhone = {
          phoneTypeId: phone.PhoneTypeId,
          phoneNumber: phone.PhoneNumber
        }
        return changedPhone;
      }),
      customerAddress: customerDetails.CustomerAddresses.map((address: CustomerAddresses) => {
        const changedAddress = {
          cityName: address.CityName,
          street: address.Street,
          street2: address.Street2,
          zip: address.Zip,
          addressTypeId: address.AddressTypeId,
          mainAddress: address.MainAddress
        }
        return changedAddress;
      }),
      customerMainInfo: customerDetails.CustomerInfoForReceiept.map((mainInfo: CustomerInfoForReceiept) => {
        const changedMainInfo = {
          customerId: mainInfo.CustomerId,
          fname: mainInfo.fname,
          lname: mainInfo.lname,
          company: mainInfo.Company,
          customerType: mainInfo.CustomerType,
          title: mainInfo.Title,
          gender: mainInfo.Gender,
          customerCode: mainInfo.CustomerCode,
          spouseName: mainInfo.SpouseName,
          fileAs: mainInfo.FileAs,
          birthday: mainInfo.BirthDate,
          afterSunset1: mainInfo.AfterSunset1
        }
        return changedMainInfo
      }),
      customerGroups: customerDetails.CustomerGroupsGeneralSet.map(group => {
        return { GroupId: group.CustomerGeneralGroupId }
      })

    }
    return newObject

  }

  createFileAs(customerInfo: CustomerMainInfo) {
    if (customerInfo) {
      let fileAs = customerInfo.fileAs;
      const fname = customerInfo.fname;
      const lname = customerInfo.lname;
      const company = customerInfo.company;

      return fileAs = fileAs ? fileAs : `${fname} ${lname} ${company}`;
    }

  }

  searchExistingCustomer() {

  }

  // getSelectedGroupsId(generalGroups: GeneralGroups[]) {
  //   const selectedGroupsId: Group[] = generalGroups.filter(group => group.isSelected === true).map(selectedGroups => {
  //     return { GroupId: selectedGroups.GroupId };
  //   });
  //   return selectedGroupsId;
  // }
  // saveNewCustomer(newCustomer: CustomerInfoByIdForCustomerInfoComponent) {
  //   this.newCustomerService.saveNewCustomer(newCustomer);
  // }

  createNewClicked() {
    this.createNewEvent$.next()
  }
}
