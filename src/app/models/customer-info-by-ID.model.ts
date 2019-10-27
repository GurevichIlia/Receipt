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

export class CustomerInfoById {
      CustomerAddresses: CustomerAddresses[];
      CustomerCreditCardTokens: any[];
      CustomerEmails: [];
      CustomerGroupsGeneralSet: []
      CustomerInfoForReceiept: []
      CustomerMobilePhones: []
      CustomerNames4Receipt: []
      GetCustomerReciepts: GetCustomerReceipts[]
      GetCustomerReciepts_CameFrom: GetCustomerReceipts[]
      GetCustomerReciepts_Involved: GetCustomerReceipts[]
      QuickGeneralGroupList: []
}

