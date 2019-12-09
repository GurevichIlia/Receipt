import { NewPaymentService } from './../new-payment.service';
import { Injectable } from '@angular/core';
import { KevaRemarkForUpdate, PaymentsService } from 'src/app/grid/payments.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KevaRemarksService {

  constructor(private paymentsService: PaymentsService) { }



  deleteKevaRemarksById(kevaRemark: KevaRemarkForUpdate) {
    return this.paymentsService.deleteKevaRemarksById(kevaRemark)
  }

  updateKevaRemarkById(kevaRemark: KevaRemarkForUpdate) {
    return this.paymentsService.updateKevaRemarkById(kevaRemark)
  }

  getKevaRemarksById(kevaId: number) {
    return this.paymentsService.getKevaRemarksById(kevaId);
  }
}
