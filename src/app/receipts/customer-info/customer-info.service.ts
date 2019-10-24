import { Customermaininfo } from './../../models/customermaininfo.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ReceiptsService } from '../services/receipts.service';
import { CustomerAddresses } from 'src/app/models/customer-info-by-ID.model';
import { GeneralSrv } from '../services/GeneralSrv.service';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { CustomerPhones, CustomerEmails, MainDetails } from 'src/app/models/fullCustomerDetailsById.model';
import { CustomerGroupById } from 'src/app/models/customerGroupById.model';
import { Phones } from 'src/app/models/phones.model';
import { Emails } from 'src/app/models/emails.model';
import { Addresses } from 'src/app/models/addresses.model';
import { Group } from './customer-info.component';

export interface CustomerInfoByIdForCustomerInfoComponent {
  customerEmails: CustomerEmails[],
  customerPhones: CustomerPhones[],
  customerAddress: CustomerAddresses[],
  customerMainInfo: Customermaininfo[] | MainDetails[],
  customerCreditCardTokens: any[],
  customerGroupList?: CustomerGroupById[]
}

@Injectable({
  providedIn: 'root'
})
export class CustomerInfoService {
  customerInfoById = new BehaviorSubject<CustomerInfoByIdForCustomerInfoComponent>(null);
  customerInfoById$ = this.customerInfoById.asObservable();

  cities = <any>[];

  customer: {
    customermaininfo: Customermaininfo,
    phones: Phones[],
    emails: Emails[],
    addresses: Addresses,
    groups: Group[]
  }
  constructor(
    private receiptService: ReceiptsService,
    private generalService: GeneralSrv
  ) { }

  patchInputValue(
    inputsArray: FormArray | FormGroup,
    valueArray: CustomerPhones[] | CustomerEmails[] | CustomerAddresses[] | Customermaininfo[] | MainDetails[],
    addNewInputFunction?: Function,
    formBuilder?: FormBuilder) {
    this.generalService.patchInputValue(inputsArray, valueArray, addNewInputFunction, formBuilder)
  }

  addCurrentAddress(currentAddres: FormGroup) {
    const address = currentAddres.value
    if (address.street === null) {
      address.street = '';
    }
    if (address.cityName === null) {
      address.cityName = '';
    }
    if (address.cityName !== '' || address.street !== '') {
      if (address.cityName.value !== '' && address.street !== '') {
        this.receiptService.fullAddress.next(`${address.cityName}, ${address.street}`);
      } else if (address.cityName !== '' || address.cityName !== null) {
        this.receiptService.fullAddress.next(`${address.cityName}`);
      } else if (address.street !== '' || address.street !== null) {
        this.receiptService.fullAddress.next(`${address.street}`);
      }
    }
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
    return checkedphones;
  }

  setCustomerInfoById(customerEmails: CustomerEmails[], customerPhones: CustomerPhones[], customerAddress: CustomerAddresses[],
    customerMainInfo: Customermaininfo[] | MainDetails[],
    customerCreditCardTokens: any[],customerGroupList?: CustomerGroupById[]
  ) {
    const customerInfoById = {
      customerEmails,
      customerPhones,
      customerAddress,
      customerMainInfo,
      customerCreditCardTokens,
      customerGroupList
    }
    this.customerInfoById.next(customerInfoById);
  }
  clearCustomerById() {
    this.customerInfoById.next(null);
  }
  getCustomerInfoById() {
    return this.customerInfoById.getValue();
  }
  getCustomerInfoById$() {
    return this.customerInfoById$;
  }
  setCities(cities: any[]) {
    this.cities = cities;
  }
  getCities() {
    return this.generalService.getCities$();
  }
  setNewCustomer(customermaininfo: Customermaininfo, phones: Phones[],emails: Emails[], addresses: Addresses, groups: Group[]) {
    this.customer = null;
    this.customer = {
      emails,
      phones,
      addresses,
      customermaininfo,
      groups
    }
  }
  getNewCustomer() {
    return this.customer;
  }
}
