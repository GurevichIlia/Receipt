import { GeneralGroups } from './../../models/generalGroups.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { FullCustomerDetailsById, CustomerEmails, CustomerPhones, MainDetails } from 'src/app/models/fullCustomerDetailsById.model';
import { CustomerInfoByIdForCustomerInfoComponent } from 'src/app/receipts/customer-info/customer-info.service';
import { CustomerAddresses, CustomerInfoById } from 'src/app/models/customer-info-by-ID.model';
import { CustomerSearchData } from 'src/app/receipts/services/GeneralSrv.service';
import { map } from 'rxjs/operators';




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

  //Список всех групп клиентов
  readonly customerGroups = new BehaviorSubject<GeneralGroups[]>(null);
  readonly customerGroups$ = this.customerGroups.asObservable()
  constructor() { }

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
          birthday: mainInfo.BirthDate,
          afterSunset1: mainInfo.AfterSunset2
        }
        return changedMainInfo
      }),
      customerGroups: customerDetails.CustomerGroupsGeneralSet
    }
    return newObject
  }

  // CUSTOMER LIST METHODS

  setCustomerList(customerList: CustomerSearchData[]) {
    this.customerList.next(customerList);
  }

  getCustomerList$() {
    return this.customerList$;
  }

  clearCustomerList() {
    this.customerList.next(null);
  }

  // CUSTOMER GROUPS METHODS

  setCustomerGroups(customerGroups: GeneralGroups[]) {
    this.customerGroups.next(customerGroups);
  }

  /** GETTING GENERAL CUSTOMER GROUPS*/
  getCustomerGroups$() {
    return this.customerGroups$
  }

  /** GETTING CUSTOMER GROUPS MARKED isSelected === True */
  getSelectedGroups$() {
    return this.customerGroups$.pipe(map(groups => groups.filter(group => group.isSelected === true)));
  }

  /** MAKING GROUP VALUE isSelected = True */
  markGroupAsSelected(groupId: number) {
    this.customerGroups.getValue().map(group => {
      if (group.GroupId === groupId) {
        group.isSelected = true
      }
      return { ...group };
    });
  }

  /** MARKING GROUP VALUE isSelected = False */
  markGroupAsNotSelected(groupId: number) {
    this.customerGroups.getValue().map(group => {
      if (group.GroupId === groupId) {
        group.isSelected = false
      }
      return { ...group };
    });

  }

  /** MARK ALL GROUPS VALUE isSelected = False, CLEAR STATE */
  clearSelectedMark() {
    const customerGroups = [...this.customerGroups.getValue().map(group => {
      if (group.isSelected) {
        group.isSelected = false;
        return group;
      } else {
        return { ...group };
      }
    })]
    this.setCustomerGroups(customerGroups);

  }

  /** UPDATE GROUPS TO SHOW IF THERE ARE SELECTED GROUPS*/
  updateCustomerGroups() {
    const customerGroups = [...this.customerGroups.getValue()];
    this.setCustomerGroups(customerGroups);

  }

}
