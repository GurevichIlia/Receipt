import { GeneralSrv } from 'src/app/receipts/services/GeneralSrv.service';
import { Injectable } from '@angular/core';
import { CustomerDetailsService } from '../customer-details.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {

  constructor(
    private customerDetailsService: CustomerDetailsService,
    private generalService: GeneralSrv
  ) {

  }

  getCustomerDetailsById() {
    return this.customerDetailsService.getCustomerDetailsByIdState$();
  }
  changeDateFormat() {
    return this.generalService.changeDateFormat
  }
}
