import { NewPaymentService } from './../new-payment.service';
import { Injectable } from '@angular/core';
import { KevaRemarkForUpdate, PaymentsService, KevaRemark } from 'src/app/grid/payments.service';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class KevaRemarksService {
  kevaRemarks = new BehaviorSubject<MatTableDataSource<KevaRemark[]>>(null);
  kevaRemarks$ = this.kevaRemarks.asObservable();
  constructor(private paymentsService: PaymentsService) { }

  setkevaRemarks(kevaRemarks) {
    this.kevaRemarks.next(kevaRemarks);
  }

  getkevaRemarks$() {
    return this.kevaRemarks$.pipe(filter(remarks => remarks !== null));
  }

  deleteKevaRemarksById(kevaRemark: KevaRemarkForUpdate) {
    return this.paymentsService.deleteKevaRemarksById(kevaRemark)
  }

  updateKevaRemarkById(kevaRemark: KevaRemarkForUpdate) {
    return this.paymentsService.updateKevaRemarkById(kevaRemark)
  }

  getKevaRemarksById(kevaId: number) {
    return this.paymentsService.getKevaRemarksById(kevaId);
  }

  clearKevaRemarks() {
    this.kevaRemarks.next(null);
  }
}
