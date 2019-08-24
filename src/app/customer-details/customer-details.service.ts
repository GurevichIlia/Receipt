import { Injectable } from '@angular/core';
import { PaymentsService } from '../grid/payments.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerDetailsService {

  constructor(
    private paymentsService: PaymentsService
  ) { }

  getCustomerDetailsById(customerId: number) {
    return this.paymentsService.getCustomerDetailsById(customerId);
  }
}
