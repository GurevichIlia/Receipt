import { Pipe, PipeTransform } from '@angular/core';
import { ReceiptType } from 'src/app/models/receiptType.interface';

@Pipe({
  name: 'paymentTypeFilter'
})
export class ReceiptTypeFilterPipe implements PipeTransform {
  transform(value: ReceiptType[], args?: string): any {
    if (args === '2' && value !== undefined) {
      return value.filter(value => value.ForCanclation === true && value.UseAsCreditReceipt === true && value.FORKEVA === true);

    } else if ((args === '1' || args === '3') && value !== undefined) {

      return value.filter(value => value.ForCanclation === true && value.UseAsCreditReceipt === false && value.FORKEVA === true);

    }
  }

}
//Pipe is working well