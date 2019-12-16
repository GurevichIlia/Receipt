import { CustomerPhones } from './fullCustomerDetailsById.model';
import { CustomerEmails } from 'src/app/models/fullCustomerDetailsById.model';
export interface CustomerAddresses {
      AddressId: number;
      AddressTypeId: number;
      AddressTypeName: string;
      AddressTypeNameEng: string;
      CityName: string;
      CountryCode: string;
      CustomerId: string;
      ForDelivery: boolean;
      FullAddress: string;
      MainAddress: boolean;
      StateId: string;
      Street: string;
      Street2: string;
      Zip: string;
      remark: string;
}

export interface GetCustomerReceipts {
      CurrencyId: string;
      ForCanclation: boolean;
      ProjectName: string;
      RecieptDate: string;
      RecieptName: string
      RecieptNo: string;
      RecieptTypeId: number;
      Total: number
      UseAsCreditReceipt: boolean;
      ValueDate: string;
      WhatFor: string;
      WhatForInThanksLet: string;
}

export interface CustomerInfoForReceiept {
      AfterSunset1: boolean;
      BirthDate: string;
      Company: string;
      CustomerCode: string;
      CustomerId: number;
      CustomerType: number;
      FileAs: string;
      Gender: number;
      MiddleName: string;
      SpouseName: string;
      Suffix: string;
      Title: string;
      fname: string;
      lname: string;
}

export interface CustomerInfoById {
      CustomerAddresses: CustomerAddresses[];
      CustomerCreditCardTokens: any[];
      CustomerEmails: CustomerEmails[];
      CustomerGroupsGeneralSet: CustomerGroupsGeneralSet[]
      CustomerInfoForReceiept: CustomerInfoForReceiept[]
      CustomerMobilePhones: CustomerPhones[]
      CustomerNames4Receipt: []
      GetCustomerReciepts: GetCustomerReceipts[]
      GetCustomerReciepts_CameFrom: GetCustomerReceipts[]
      GetCustomerReciepts_Involved: GetCustomerReceipts[]
      QuickGeneralGroupList: QuickCustomerGroupList[]
}

export interface QuickCustomerGroupList {
      CategoryId: number;
      GroupId: number;
      GroupName: string;
      GroupNameEng: string;
      GroupParenCategory: number;
      SortOrder: number;
}

export interface CustomerGroupsGeneralSet {
      CustomerGeneralGroupId: number;
      Customerid: number;
      GroupStatusId: number;
      JoinDate: string;
      SortOrder: number;
      isTop: boolean;
      isWork: boolean;
}

