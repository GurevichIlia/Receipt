import { CreditCardAccount } from './credit-card-account.model';

export class GlobalData {
      Accounts: CreditCardAccount[];
      Associations: [];
      Banks: [];
      CustomerTitle: CustomerTitle[];
      DonationTypes: [];
      GetCurrencyTypes: [];
      GetCustomerTypes: [];
      KevaBanks: [];
      KevaStatus: [];
      KevaGroups: [];
      Orgs: [];
      PaymentTypes: [];
      PhoneTypes: [];
      Projects4Receipts: [];
      ProjectsCategories: [];
      ReceiptThanksLetter: [];
      ReceiptTypes: [];
      institutes: [];
      GetEmployees: [];
      GetEmployeesAll: [];
      kevaReturnReson: [];
}

export interface CustomerTitle {
      TitleEng: string;
      TitleHeb: string;
      TitleId: string
}