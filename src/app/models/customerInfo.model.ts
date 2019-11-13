import { Addresses } from './addresses.model';
import { Emails } from './emails.model';
import { Phones } from './phones.model';
import { Group } from '../receipts/customer-info/customer-info.component';
import { CustomerMainInfo } from './customermaininfo.model';

export class Customerinfo {
      customerMainInfo: CustomerMainInfo;
      phones: Phones [];
      emails: Emails [];
      addresses: Addresses;
      groups: Group[];
}