
import { Creditcard } from './creditCard.model';
import { Customerinfo } from './customerInfo.model';
import { Receipt } from './receipt.model';


export class NewReceipt {
      customerInfo: Customerinfo;
      Receipt: Receipt;
      PaymentType: number;
      creditCard: Creditcard;
}