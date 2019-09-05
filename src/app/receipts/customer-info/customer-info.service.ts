import { Injectable } from '@angular/core';
import { ReceiptsService } from '../services/receipts.service';
import { CustomerInfoById } from 'src/app/models/customer-info-by-ID.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerInfoService {

  constructor(private receiptsService: ReceiptsService) { }

  getCustomerInfoById(): Observable<CustomerInfoById> {
    return this.receiptsService.getCustomerInfoById();
  }
}
