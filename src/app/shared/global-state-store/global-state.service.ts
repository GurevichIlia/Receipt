import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { FullCustomerDetailsById, CustomerEmails, CustomerPhones, MainDetails } from 'src/app/models/fullCustomerDetailsById.model';
import { CustomerInfoByIdForCustomerInfoComponent } from 'src/app/receipts/customer-info/customer-info.service';
import { CustomerAddresses, CustomerInfoById } from 'src/app/models/customer-info-by-ID.model';
import { CustomerSearchData } from 'src/app/receipts/services/GeneralSrv.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  // Хранит данные о кастомере если где то запрашивалась инфа по id
  customerDetailsById = new BehaviorSubject<FullCustomerDetailsById>(null);
  customerDetailsById$ = this.customerDetailsById.asObservable();

  // Список кастомеров для поиска
  customerList = new BehaviorSubject<CustomerSearchData[]>(null);
  customerList$ = this.customerList.asObservable();
  constructor() { }

  setCustomerDetailsByIdGlobalState(value) {
    this.customerDetailsById.next(value);
  }

  getCustomerDetailsByIdGlobalState() {
    return this.customerDetailsById.getValue();
  }

  getCustomerDetailsByIdGlobalState$(): Observable<FullCustomerDetailsById> {
    return this.customerDetailsById$;
  }

  getCustomerDetailsByIdTranformedForCUstomerInfoComponent(): CustomerInfoByIdForCustomerInfoComponent {
    return this.transformCustomerDetailsForCustomerInfoComponent(this.getCustomerDetailsByIdGlobalState())
  }

  transformCustomerDetailsForCustomerInfoComponent(customerDetails: FullCustomerDetailsById ) {
    const newObject: CustomerInfoByIdForCustomerInfoComponent = {
      customerEmails: customerDetails.CustomerEmails.map((email: CustomerEmails) => {
        const changedEmail = {
          emailName: email.EmailName,
          email: email.Email
        }
        return changedEmail;
      }),
      customerPhones: customerDetails.GetCustomerPhones.map((phone: CustomerPhones) => {
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
      customerMainInfo: customerDetails.CustomerCard_MainDetails.map((mainInfo: MainDetails) => {
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
          afterSunset1: mainInfo.AfterSunset2
        }
        return changedMainInfo
      }),
    }
    return newObject
  }

  setCustomerList(customerList: CustomerSearchData[]) {
    this.customerList.next(customerList);
  }

  getCustomerList$() {
    return this.customerList$;
  }

  clearCustomerInfoById() {
    this.customerDetailsById.next(null);
  }

  clearCustomerList() {
    this.customerList.next(null);
  }

}
