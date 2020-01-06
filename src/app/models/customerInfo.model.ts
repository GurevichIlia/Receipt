import { Addresses } from './addresses.model';
import { Emails } from './emails.model';
import { Phones } from './phones.model';
import { CustomerMainInfo } from './customermaininfo.model';
import { Group } from '../shared/services/receipts.service';

export class Customerinfo {
      customerMainInfo: CustomerMainInfo;
      phones: Phones [];
      emails: Emails [];
      addresses: Addresses[];
      groups: Group[];
}