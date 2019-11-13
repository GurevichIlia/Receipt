import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FullCustomerDetailsById, CustomerEmails, CustomerPhones, MainDetails } from 'src/app/models/fullCustomerDetailsById.model';
import { CustomerInfoByIdForCustomerInfoComponent } from 'src/app/receipts/customer-info/customer-info.service';
import { CustomerAddresses } from 'src/app/models/customer-info-by-ID.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  customerDetailsById = new BehaviorSubject<FullCustomerDetailsById>(null);// Хранит данные о кастомере если где то запрашивалась инфа по id;
  customerDetailsById$ = this.customerDetailsById.asObservable();


  constructor() { }

  setCustomerDetailsByIdGlobalState(value) {
    debugger
    this.customerDetailsById.next(value);
  }

  getCustomerDetailsByIdGlobalState() {
    return this.customerDetailsById.getValue();
  }

  getCustomerDetailsByIdState$(): Observable<FullCustomerDetailsById> {
    return this.customerDetailsById$;
  }

  getCustomerDetailsByIdTranformedForCUstomerInfoComponent(): CustomerInfoByIdForCustomerInfoComponent {
    return this.transformCustomerDetailsForCustomerInfoComponent(this.getCustomerDetailsByIdGlobalState())
  }

  transformCustomerDetailsForCustomerInfoComponent(customerDetails: FullCustomerDetailsById) {
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
          addressTypeId: address.AddressTypeId
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
}
