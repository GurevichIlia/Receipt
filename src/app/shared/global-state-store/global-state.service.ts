import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { FullCustomerDetailsById, CustomerEmails, CustomerPhones, MainDetails } from 'src/app/models/fullCustomerDetailsById.model';
import { CustomerInfoByIdForCustomerInfoComponent } from 'src/app/receipts/customer-info/customer-info.service';
import { CustomerAddresses, CustomerInfoById } from 'src/app/models/customer-info-by-ID.model';
import { CustomerSearchData, GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { map, tap, filter, shareReplay } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  // Хранит данные о кастомере если где то запрашивалась инфа по id
  customerDetailsById = new BehaviorSubject<FullCustomerDetailsById>(null);
  customerDetailsById$ = this.customerDetailsById.asObservable();

  // Список кастомеров для поиска
  // customerSearchList = new BehaviorSubject<CustomerSearchData[]>(null);
  // customerSearchList$ = this.customerSearchList.asObservable();

  private customerSearchList$: Observable<CustomerSearchData[]>


  cities = new BehaviorSubject<any[]>(null);
  cities$ = this.cities.asObservable();



  constructor(private generalService: GeneralSrv) { }

  // CUSTOMER DEYAILS BY ID METHODS
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

  clearCustomerInfoById() {
    this.customerDetailsById.next(null);
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
          birthday: this.generalService.changeDateFormat(mainInfo.BirthDate, 'DD/MM/YYYY'),
          afterSunset1: mainInfo.AfterSunset2
        }
        return changedMainInfo
      }),
      customerGroups: customerDetails.CustomerGroupsGeneralSet.map(group => {
        return { GroupId: group.CustomerGeneralGroupId }
      }),

    }
    return newObject
  }

  // CUSTOMER SEARCH LIST METHODS

  // setCustomerSearchList(customerList: CustomerSearchData[]) {
  //   console.log('SEARCH DATA NEW STATE', customerList)
  //   this.customerSearchList.next(customerList);
  // }

  getCustomerSearchList$() {
    if (!this.customerSearchList$) {
      this.customerSearchList$ = this.generalService.getUsers().pipe(map(customers => customers.filter(customer => customer.FileAs1.trim() !== '')))
        .pipe(tap(customers => console.log('CUSTOMER SEARCH DATA', customers)), shareReplay(1));
    }
    return this.customerSearchList$
  }

  clearCustomerList() {
    this.customerSearchList$ = null
  }

  // CITIES METHODS

  setCities(cities: any[]) {
    this.cities.next(cities);
  }

  getCities$() {
    if (this.cities.getValue()) {
      return this.cities$;
    } else {
      return this.generalService.GetSystemTables().pipe(map(systemData => systemData.Cities));
    }

  }

}
