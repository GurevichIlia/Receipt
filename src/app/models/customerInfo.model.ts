import { Customermaininfo } from './customermaininfo.model';
import { Addresses } from './addresses.model';
import { Emails } from './emails.model';
import { Phones } from './phones.model';
import { Group } from '../receipts/customer-info/customer-info.component';

export class Customerinfo {
      customermaininfo: Customermaininfo;
      phones: Phones [];
      emails: Emails [];
      addresses: Addresses;
      groups: Group[];
}