import { NewKevaDetails } from 'src/app/models/newKevaDetails.model';
import { Creditcard } from 'src/app/models/creditCard.model';
import { Customerinfo } from './customerInfo.model';

export interface NewKevaFull {
      customerInfo: Customerinfo;
      creditCard: Creditcard;
      KevaDetails: NewKevaDetails;
      HokType:	string
}