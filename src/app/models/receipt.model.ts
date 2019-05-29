import { Product } from 'src/app/models/products.model';
import { ReceiptHeader } from './receiptHeader.model';
import { Receiptlines } from './receiptlines.model';

export class Receipt {
      ReceiptHeader: ReceiptHeader;
      recieptlines: Receiptlines [];
      products: Product [];
}